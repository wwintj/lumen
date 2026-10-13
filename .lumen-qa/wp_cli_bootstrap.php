<?php
/**
 * Shared bootstrap for the direct-DB PHP helpers.
 *
 * Loads the real WordPress install (wp-load.php) so helpers operate against the
 * genuine WP data model (hooks, meta, term_taxonomy relationships, comment
 * threading, role/capability bookkeeping) instead of hand-written SQL. The QA
 * bypasses the flaky `wp` CLI for these ops; this bootstrap is what keeps the
 * operations Core-native.
 *
 * Contract:
 *   - WP_ROOT env must point at the WordPress install dir (set by qa-beta1.js).
 *   - On success the script emits exactly one JSON line on STDOUT and exits 0.
 *   - Any WP error/warning is suppressed from stdout so the JSON parse stays valid.
 *
 * Note on this environment: this is a stripped WordPress 7.1.1 build where a few
 * standard functions (wp_delete_user, get_user_pass, get_user_by) are absent and
 * some return non-standard values (wp_insert_term -> array). Where a Core
 * function is missing, the helper falls back to a minimal, clearly-scoped direct
 * SQL operation — the *only* way to reach that behavior in this build — and it
 * is isolated to the narrowest necessary rows.
 */

if ( defined( 'WP_LOAD' ) ) {
    exit( 0 );
}

// Quiet bootstrap: keep only the JSON on stdout clean.
ini_set( 'display_errors', '0' );
ini_set( 'log_errors', '1'); error_reporting(E_ALL);
error_reporting( 0 );

/**
 * Resolve the WordPress root. Prefer the WP_ROOT env (set by qa-beta1.js, which
 * knows the exact install path); otherwise try a small set of well-known local
 * locations so the helper also works when invoked interactively.
 */
function lumen_qa_resolve_wp_root() {
    $root = getenv( 'WP_ROOT' );
    if ( $root && is_file( $root . '/wp-load.php' ) ) {
        return $root;
    }
    $candidates = array(
        dirname( __DIR__ ) . '/.runtime/wordpress',
        __DIR__ . '/../../.runtime/wordpress',
    );
    foreach ( $candidates as $c ) {
        if ( is_file( $c . '/wp-load.php' ) ) {
            return $c;
        }
    }
    return null;
}

function lumen_qa_fail( $message, $code = 1 ) {
    fwrite( STDOUT, json_encode( array( 'code' => (int) $code, 'error' => $message ) ) . "\n" );
    exit( 0 );
}

$root = lumen_qa_resolve_wp_root();
if ( ! $root ) {
    lumen_qa_fail( 'WP root not found; set WP_ROOT to the WordPress install dir' );
}

// Load the real WordPress core. wp-load.php sets up $wpdb and the plugin/theme
// bootstrap. This is the point at which "Core data model" is in effect.
require_once $root . '/wp-load.php';

/**
 * Emit a JSON object on stdout and stop. This is the *only* writer of the
 * payload to stdout, so the QA's JSON.parse() stays reliable.
 */
function lumen_qa_out( $data ) {
    fwrite( STDOUT, json_encode( $data ) . "\n" );
    exit( 0 ); }

/**
 * Read-only environment identity for the destructive-operation safety gate.
 *
 * Reports what WordPress is *actually* loaded against, so the QA driver can
 * refuse to touch fixtures unless the target is provably the local test
 * install. Strictly read-only: no writes, no option changes, no credentials
 * echoed back (only the database NAME is reported, never the user or password).
 */
function lumen_qa_env_identity() {
    global $wpdb;
    return array(
        'code'     => 0,
        // Actual connected database, straight from the live connection.
        'database' => isset( $wpdb->dbname ) ? (string) $wpdb->dbname : '',
        'dbhost'   => isset( $wpdb->dbhost ) ? (string) $wpdb->dbhost : '',
        'siteurl'  => function_exists( 'get_option' ) ? (string) get_option( 'siteurl' ) : '',
        'home'     => function_exists( 'get_option' ) ? (string) get_option( 'home' ) : '',
        'abspath'  => defined( 'ABSPATH' ) ? (string) ABSPATH : '',
        // Constants that could silently redirect the install.
        'wp_home_const'    => defined( 'WP_HOME' ) ? (string) WP_HOME : null,
        'wp_siteurl_const' => defined( 'WP_SITEURL' ) ? (string) WP_SITEURL : null,
        'table_prefix'     => isset( $wpdb->prefix ) ? (string) $wpdb->prefix : '',
        'error'    => '',
    );
}

// Re-export a tiny helper for reading a single row from wp_users by login,
// because get_user_by()/get_user_pass() are absent in this stripped build.
// Scoped to a single select; the *write* path for users still goes through Core
// (wp_insert_user / wp_update_user / WP_User::set_role).
//
// NOTE: this stripped build's $wpdb->prepare() is only reliable for %d
// integer placeholders; string placeholders (%s/%p) come out mangled
// (e.g. {<hash>}s), so string equality checks are done with a raw,
// addslashes()-escaped query here. $login is always a QA-generated,
// trusted identifier in this sandbox.
function lumen_qa_user_row( $login ) {
    global $wpdb;
    $safe = addslashes( $login );
    return $wpdb->get_row(
        'SELECT * FROM ' . $wpdb->users . ' WHERE user_login = \'' . $safe . '\' LIMIT 1',
        // wpdb get_row() output-type constants are string-valued in this
        // stripped build; MYSQLI_ASSOC (int 1) did not match and returned NULL.
        ARRAY_A
    );
}
