<?php
/**
 * User operations. Core-native: loads the real WordPress install (wp-load.php)
 * and performs creation / password changes through WordPress itself
 * (wp_insert_user / wp_update_user), so user rows, usermeta, roles and
 * capability bookkeeping are maintained by Core - not hand-written SQL.
 *
 * This is a stripped WordPress 7.1.1 build where a few Core functions are
 * absent:
 *   - wp_delete_user(), get_user_by() and get_user_pass() are not defined by
 *     default. The delete path loads the Core admin include
 *     (ABSPATH . 'wp-admin/includes/user.php') that defines wp_delete_user(),
 *     so deletion also goes through Core.
 *   - User lookup by login falls back to lumen_qa_user_row(), a single
 *     read-only SELECT on wp_users provided by the bootstrap.
 *
 * All writes go through Core (wp_insert_user / wp_update_user /
 * wp_delete_user); the only direct SQL is the read-only single-row login
 * lookup in the bootstrap. No raw SQL writes remain.
 */

require_once __DIR__ . '/wp_cli_bootstrap.php';

$input = json_decode( fread( STDIN, 1048576 ), true );
if ( ! is_array( $input ) || empty( $input[ 'action' ] ) ) {
    lumen_qa_out( array( 'code' => 1, 'error' => 'bad input' ) );
}
$action   = $input[ 'action' ];
$login    = $input[ 'login' ] ?? '';
$password = $input[ 'password' ] ?? '';
$email    = $input[ 'email' ] ?? '';

/**
 * Resolve a user id by login (get_user_by() is absent here).
 */
function lumen_qa_user_id( $login ) {
    $row = lumen_qa_user_row( $login );
    return $row ? (int) $row[ 'ID' ] : 0;
}

/**
 * Read-only environment identity, used by the QA destructive-operation safety
 * gate. Reports the live database / URLs this PHP process is actually loaded
 * against. No writes, no credentials.
 */
if ( $action === 'env_identity' ) {
    lumen_qa_out( lumen_qa_env_identity() );
}

/**
 * Read-only identity lookup for a single user. Core-native: roles come from
 * get_userdata() when available, the row itself from the bootstrap's
 * single-row read-only SELECT. Used by QA preflight to prove that a residual
 * account really is the QA fixture account before any deletion is attempted.
 * No writes, no wildcard search.
 */
if ( $action === 'get_user' ) {
    if ( $login === '' ) {
        lumen_qa_out( array( 'code' => 1, 'error' => 'login is required' ) );
    }
    $row = lumen_qa_user_row( $login );
    if ( ! $row ) {
        lumen_qa_out( array( 'code' => 0, 'exists' => false, 'error' => '' ) );
    }
    $id    = (int) $row[ 'ID' ];
    $roles = array();
    if ( function_exists( 'get_userdata' ) ) {
        $u = get_userdata( $id );
        if ( $u instanceof WP_User ) {
            $roles = array_values( (array) $u->roles );
        }
    }
    lumen_qa_out( array(
        'code'   => 0,
        'exists' => true,
        'id'     => $id,
        'login'  => isset( $row[ 'user_login' ] ) ? (string) $row[ 'user_login' ] : '',
        'email'  => isset( $row[ 'user_email' ] ) ? (string) $row[ 'user_email' ] : '',
        'roles'  => $roles,
        'error'  => '',
    ) );
}

if ( $action === 'create_user' ) {
    if ( $login === '' || $password === '' ) {
        lumen_qa_out( array( 'code' => 1, 'error' => 'login and password are required' ) );
    }
    $existing_id = lumen_qa_user_id( $login );
    if ( $existing_id !== 0 ) {
        lumen_qa_out( array( 'code' => 1, 'error' => 'user exists', 'id' => $existing_id ) );
    }
    // Core creation: wp_insert_user handles password hashing (wp_hash_password),
    // user_registered, user_status, usermeta (wp_roles / wp_user_roles) and
    // role bookkeeping (WP_User::set_role).
    $id = wp_insert_user( array(
        'user_login'   => $login,
        'user_email'   => $email,
        'user_pass'    => $password,
        'display_name' => $login,
        'role'         => 'administrator',
    ) );
    if ( is_wp_error( $id ) ) {
        lumen_qa_out( array(
            'code'  => 1,
            'error' => $id->get_error_message() . ' [' . $id->get_error_code() . ']',
        ) );
    } else {
        lumen_qa_out( array(
            'code'  => 0,
            'id'    => (int) $id,
            'login' => $login,
        ) );
    }
}

if ( $action === 'set_password' ) {
    $uid = lumen_qa_user_id( $login );
    if ( $uid === 0 ) {
        lumen_qa_out( array( 'code' => 1, 'error' => 'no such user' ) );
    }
    // Core: wp_update_user hashes a changing plaintext password and keeps
    // role / usermeta intact.
    $ok = wp_update_user( array( 'ID' => $uid, 'user_pass' => $password ) );
    if ( is_wp_error( $ok ) ) {
        lumen_qa_out( array(
            'code'    => 1,
            'affected'=> 0,
            'error'   => $ok->get_error_message() . ' [' . $ok->get_error_code() . ']',
        ) );
    } else {
        lumen_qa_out( array( 'code' => 0, 'affected' => 1, 'error' => '' ) );
    }
}

if ( $action === 'check_password' ) {
    $row = lumen_qa_user_row( $login );
    if ( ! $row ) {
        lumen_qa_out( array( 'code' => 1, 'ok' => false, 'error' => 'no such user' ) );
    }
    // wp_check_password() correctly handles the $wp$-prefixed hash produced by
    // wp_hash_password(); raw password_verify() does not in this stripped build.
    $ok = wp_check_password( $password, $row[ 'user_pass' ] );
    lumen_qa_out( array(
        'code'  => $ok ? 0 : 1,
        'ok'    => (bool) $ok,
        'error' => $ok ? '' : 'password mismatch',
    ) );
}

if ( $action === 'delete_user' ) {
    $uid = lumen_qa_user_id( $login );
    if ( $uid === 0 ) {
        lumen_qa_out( array( 'code' => 1, 'error' => 'no such user' ) );
    }
    // Core deletion. This stripped build does not define wp_delete_user() by
    // default, so load the Core admin include that does (function_exists
    // guard keeps stock builds untouched). No raw SQL writes are used.
    if ( ! function_exists( 'wp_delete_user' ) ) {
        require_once ABSPATH . 'wp-admin/includes/user.php';
    }
    $deleted = wp_delete_user( $uid, true );
    if ( is_wp_error( $deleted ) ) {
        lumen_qa_fail( $deleted->get_error_message() . ' [' . $deleted->get_error_code() . ']' );
    }
    // Verify the user is gone (this build's wp_delete_user() return value is
    // not reliable, so removal is verified rather than inferred); read-only
    // lookup only.
    $still = lumen_qa_user_id( $login );
    lumen_qa_out( array(
        'code'   => $still ? 1 : 0,
        'id'     => $uid,
        'error'  => $still ? 'user still present after delete' : '',
    ) );
}

lumen_qa_out( array( 'code' => 1, 'error' => 'unknown action' ) );
