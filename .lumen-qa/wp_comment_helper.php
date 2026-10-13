<?php
/**
 * Comment operations. Core-native: loads the real WordPress install
 * (wp-load.php) via the shared QA bootstrap and performs creation /
 * deletion through WordPress itself (wp_insert_comment / wp_delete_comment),
 * so comment rows, meta and count bookkeeping are maintained by Core - not
 * hand-written SQL.
 *
 * This stripped WordPress 7.1.1 build may be missing get_user_by(); the
 * read-only user-existence check falls back to a single-row SELECT on
 * wp_users (read-only SQL is the only way to reach that lookup here).
 *
 * Contract (same as the other QA helpers):
 *   - WP_ROOT env must point at the WordPress install dir (set by
 *     qa-beta1.js); the bootstrap resolves it when unset.
 *   - On success the script emits exactly one JSON line on STDOUT and
 *     exits 0.
 *
 * Supported actions and responses:
 *   create_comment { post_id, user_id, content, author, email }
 *     -> { code: 0, id: int }
 *   delete_comment { id }
 *     -> { code: 0, deleted: int }  (code 1 if the row is still present)
 *   list_comments
 *     -> { code: 0, rows: [ { comment_ID, comment_post_ID,
 *                            comment_author, comment_author_email,
 *                            comment_author_url, comment_author_IP,
 *                            comment_date, comment_date_gmt,
 *                            comment_content, comment_karma,
 *                            comment_approved, comment_agent,
 *                            comment_type, comment_parent, user_id } ] }
 */

require_once __DIR__ . '/wp_cli_bootstrap.php';

$input = json_decode( fread( STDIN, 1048576 ), true );
if ( ! is_array( $input ) || empty( $input['action'] ) ) {
    lumen_qa_fail( 'bad input' );
}

$act     = $input['action'];
$postId  = isset( $input['post_id'] ) ? (int) $input['post_id'] : null;
$userId  = isset( $input['user_id'] ) ? (int) $input['user_id'] : null;
$content = $input['content'] ?? '';
$author  = $input['author'] ?? '';
$email   = $input['email'] ?? '';
$id      = isset( $input['id'] ) ? (int) $input['id'] : null;

/**
 * Read-only user existence check. Prefers Core get_user_by(); falls back
 * to a single-row read-only SELECT when the stripped build lacks it.
 */
function lumen_qa_user_exists( $user_id ) {
    if ( function_exists( 'get_user_by' ) ) {
        return (bool) get_user_by( 'ID', $user_id );
    }
    global $wpdb;
    return (bool) $wpdb->get_var(
        $wpdb->prepare( 'SELECT ID FROM ' . $wpdb->users . ' WHERE ID = %d LIMIT 1', $user_id )
    );
}

/**
 * Normalise a WP_Comment object to the stable row shape consumed by the QA.
 * Uses only the public WP_Comment property names; ID-like fields are cast to
 * int. No protected internal properties are accessed.
 */
function lumen_qa_comment_row( $c ) {
    return array(
        'comment_ID'           => (int) $c->comment_ID,
        'comment_post_ID'      => (int) $c->comment_post_ID,
        'comment_author'       => $c->comment_author,
        'comment_author_email' => $c->comment_author_email,
        'comment_author_url'   => $c->comment_author_url,
        'comment_author_IP'    => $c->comment_author_IP,
        'comment_date'         => $c->comment_date,
        'comment_date_gmt'     => $c->comment_date_gmt,
        'comment_content'      => $c->comment_content,
        'comment_karma'        => (int) $c->comment_karma,
        'comment_approved'     => $c->comment_approved,
        'comment_agent'        => $c->comment_agent,
        'comment_type'         => $c->comment_type,
        'comment_parent'       => (int) $c->comment_parent,
        'user_id'              => (int) $c->user_id,
    );
}

if ( $act === 'create_comment' ) {
    if ( $postId === null || $userId === null || $content === '' ) {
        lumen_qa_fail( 'missing post_id, user_id, or content' );
    }
    // Read-only Core verification before the write (mirrors the old helper's
    // preflight checks, now through normal Core APIs).
    $post = get_post( $postId );
    if ( ! $post || 'post' !== $post->post_type || 'publish' !== $post->post_status ) {
        lumen_qa_fail( 'post not found or not published: ' . $postId );
    }
    if ( ! lumen_qa_user_exists( $userId ) ) {
        lumen_qa_fail( 'user not found: ' . $userId );
    }
    // Core write: wp_insert_comment() handles the comment row, date/GMT and
    // count bookkeeping.
    $comment_id = wp_insert_comment( array(
        'comment_post_ID'      => $postId,
        'comment_author'       => $author,
        'comment_author_email' => $email,
        'comment_author_url'   => '',
        'comment_author_IP'    => '127.0.0.1',
        'comment_content'      => $content,
        'comment_status'       => 'publish',
        'comment_type'         => 'comment',
        'comment_parent'       => 0,
        'user_id'              => $userId,
    ) );
    if ( is_wp_error( $comment_id ) ) {
        lumen_qa_fail( $comment_id->get_error_message() . ' [' . $comment_id->get_error_code() . ']' );
    }
    // Verify the row via Core and validate it with the real WP_Comment
    // property names (IDs cast to int).
    $c = get_comment( (int) $comment_id );
    if ( ! $c || (int) $c->comment_ID !== (int) $comment_id || (int) $c->comment_post_ID !== $postId ) {
        lumen_qa_fail( 'created comment not verifiable via get_comment(): ' . $comment_id );
    }
    lumen_qa_out( array( 'code' => 0, 'id' => (int) $c->comment_ID ) );
}

if ( $act === 'delete_comment' ) {
    if ( $id === null || $id < 1 ) {
        lumen_qa_fail( 'missing comment id' );
    }
    // Core write: wp_delete_comment() removes the row (and related meta)
    // through Core.
    $deleted = wp_delete_comment( $id );
    if ( is_wp_error( $deleted ) ) {
        lumen_qa_fail( $deleted->get_error_message() . ' [' . $deleted->get_error_code() . ']' );
    }
    // Verify the row is gone via Core (this build's wp_delete_comment()
    // return may be falsy even on success, so removal is verified rather
    // than inferred); read-only check only.
    $still = get_comment( $id );
    lumen_qa_out( array(
        'code'    => $still ? 1 : 0,
        'deleted' => (int) $deleted,
        'error'   => $still ? 'comment still present after delete' : '',
    ) );
}

if ( $act === 'list_comments' ) {
    // Core read: all comments (any status), normalised to WP_Comment rows.
    $comments = get_comments( array( 'comment_status' => 'all' ) );
    $rows = array();
    foreach ( $comments as $c ) {
        if ( $c instanceof WP_Comment ) {
            $rows[] = lumen_qa_comment_row( $c );
        }
    }
    lumen_qa_out( array( 'code' => 0, 'rows' => $rows ) );
}

lumen_qa_fail( 'unknown action' );
