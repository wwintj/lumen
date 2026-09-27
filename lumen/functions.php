<?php
/**
 * Lumen — theme bootstrap.
 *
 * This file only defines constants and loads `inc/` files.
 * It contains no business logic.
 *
 * @package lumen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'LUMEN_VERSION', '1.1.0-dev.8' );
define( 'LUMEN_DIR', get_template_directory() );
define( 'LUMEN_URI', get_template_directory_uri() );
define( 'LUMEN_TEXT_DOMAIN', 'lumen' );

require_once LUMEN_DIR . '/inc/setup.php';
require_once LUMEN_DIR . '/inc/enqueue.php';
require_once LUMEN_DIR . '/inc/template-functions.php';
require_once LUMEN_DIR . '/inc/template-tags.php';
