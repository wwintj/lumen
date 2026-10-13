<?php
/**
 * Term operations. Core-native: loads the real WordPress install (wp-load.php)
 * and performs creation / deletion through WordPress itself (wp_insert_term /
 * wp_delete_term), so term, term_taxonomy and term_relationship rows, count
 * updates and caches are maintained by Core — not hand-written SQL.
 *
 * This is a stripped WordPress 7.1.1 build where a few Core behaviours differ
 * from stock WordPress:
 *   - wp_insert_term() returns { term_id, term_taxonomy_id } (an array), not
 *     the bare term_id int.
 *   - wp_delete_term() can return a falsy value even on success, so removal is
 *     verified rather than inferred from the return.
 *   - get_term_by() uses a strict positional signature
 *     get_term_by( $field, $value, $taxonomy, $output = OBJECT, $filter = 'raw' )
 *     where $field is a string ('id', 'slug', 'name', ...) and $value is the
 *     lookup value; $value has no default and an empty $taxonomy always
 *     returns false. Passing an array as $field or omitting $value throws
 *     ArgumentCountError, so always use ( 'id', $id, $taxonomy ).
 *   - get_terms() is the reliable way to find a term id by name across a
 *     taxonomy (or all taxonomies when 'taxonomy' is omitted).
 *   - The QA contract lets delete_term/term_exists be called by bare name or
 *     bare id with the taxonomy implicit; resolving that taxonomy for a given
 *     term_id is a *read-only* lookup of the term_taxonomy table (unavoidable),
 *     after which deletion itself is Core.
 *
 * All of these are normalised into the stable { code, ... } contract the QA
 * consumes.
 */

require_once __DIR__ . '/wp_cli_bootstrap.php';

$input = json_decode( fread( STDIN, 1048576 ), true );
if ( ! is_array( $input ) || empty( $input[ 'action' ] ) ) {
    lumen_qa_out( array( 'code' => 1, 'error' => 'bad input' ) );
}
$action = $input[ 'action' ];
$tax    = $input[ 'tax' ] ?? '';
$name   = $input[ 'name' ] ?? '';
$slug   = $input[ 'slug' ] ?? '';
$id     = isset( $input[ 'id' ] ) ? (int) $input[ 'id' ] : null;

/**
 * Return the taxonomies a term belongs to. A narrow, read-only lookup of
 * term_taxonomy; no write model is bypassed here.
 */
function lumen_qa_term_taxonomies( $term_id ) {
    global $wpdb;
    return $wpdb->get_col( $wpdb->prepare(
        'SELECT DISTINCT taxonomy FROM ' . $wpdb->term_taxonomy . ' WHERE term_id = %d',
        $term_id
    ) );
}

/**
 * Find a term object by id, resolving its primary taxonomy.
 */
function lumen_qa_get_term( $term_id ) {
    $term_id = (int) $term_id;
    foreach ( lumen_qa_term_taxonomies( $term_id ) as $tax ) {
        $t = get_term_by( 'id', $term_id, $tax );
        if ( $t ) {
            return $t;
        }
    }
    return null;
}

if ( $action === 'term_exists' ) {
    $found_id = null;
    if ( $id !== null && $id > 0 ) {
        $t = lumen_qa_get_term( $id );
        $found_id = $t ? (int) $t->term_id : null;
    } elseif ( $name !== '' ) {
        // Look up by name across all taxonomies (the QA calls term_exists with
        // just a name). get_terms returns ids; a non-empty list means it exists.
        $terms = get_terms( array(
            'name'       => $name,
            'hide_empty' => false,
            'fields'     => 'ids',
        ) );
        if ( $terms && ! empty( $terms ) ) {
            $found_id = (int) reset( $terms );
        }
    }
    lumen_qa_out( array(
        'code'   => $found_id ? 0 : 1,
        'id'     => $found_id ? (int) $found_id : null,
        'exists' => (bool) $found_id,
    ) );
}

if ( $action === 'delete_term' ) {
    if ( $id === null && $name !== '' ) {
        $terms = get_terms( array(
            'name'       => $name,
            'hide_empty' => false,
            'fields'     => 'ids',
        ) );
        if ( $terms && ! empty( $terms ) ) {
            $id = (int) reset( $terms );
        }
    }
    if ( $id === null || $id < 1 ) {
        lumen_qa_out( array( 'code' => 1, 'error' => 'no id or name' ) );
    }
    // Delete through Core for every taxonomy the term belongs to.
    foreach ( lumen_qa_term_taxonomies( $id ) as $tax ) {
        wp_delete_term( $id, $tax, array( 'force' => true, 'unlink_all' => true ) );
    }
    // Verify the term row is gone (this build's wp_delete_term() return is not
    // reliable).
    global $wpdb;
    $still = $wpdb->get_var( $wpdb->prepare(
        'SELECT 1 FROM ' . $wpdb->terms . ' WHERE term_id = %d LIMIT 1',
        $id
    ) );
    lumen_qa_out( array(
        'code'    => $still ? 1 : 0,
        'deleted' => $id,
        'error'   => $still ? 'term still present after delete' : '',
    ) );
}

if ( $action === 'create_term' ) {
    if ( $name === '' || $tax === '' ) {
        lumen_qa_out( array( 'code' => 1, 'error' => 'name and tax are required' ) );
    }
    // Pre-existing term: return its id + slug so the caller can delete or reuse.
    $existing = get_terms( array(
        'name'     => $name,
        'taxonomy' => $tax,
        'hide_empty' => false,
        'fields'   => 'ids',
    ) );
    if ( $existing && ! empty( $existing ) ) {
        $tid  = (int) reset( $existing );
        $t    = get_term_by( 'id', $tid, $tax );
        lumen_qa_out( array(
            'code'     => 0,
            'id'       => $tid,
            'slug'     => $t ? $t->slug : null,
            'existing' => true,
        ) );
    }
    $args = array(
        'parent'      => 0,
        'description' => $input[ 'description' ] ?? '',
    );
    if ( $slug !== '' ) {
        $args[ 'slug' ] = $slug;
    }
    $result = wp_insert_term( $name, $tax, $args );
    if ( is_wp_error( $result ) ) {
        lumen_qa_out( array(
            'code'  => 1,
            'error' => $result->get_error_message() . ' [' . $result->get_error_code() . ']',
        ) );
    }
    // Normalise the non-standard array return (and accept a bare int, too).
    if ( is_array( $result ) && isset( $result[ 'term_id' ] ) ) {
        $tid  = (int) $result[ 'term_id' ];
    } else {
        $tid  = (int) $result;
    }
    $created = get_term_by( 'id', $tid, $tax );
    $out_slug = $created ? $created->slug : ( $slug !== '' ? $slug : strtolower( str_replace( ' ', '-', $name ) ) );
    lumen_qa_out( array(
        'code'     => 0,
        'id'       => $tid,
        'slug'     => $out_slug,
        'existing' => false,
    ) );
}

lumen_qa_out( array( 'code' => 1, 'error' => 'unknown action' ) );
