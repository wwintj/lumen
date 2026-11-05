<?php
/**
 * Lumen — theme bootstrap.
 *
 * Defines constants and loads the files in inc/. No logic lives here.
 *
 * @package lumen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'LUMEN_VERSION', '1.3.12' );
define( 'LUMEN_DIR', get_template_directory() );
define( 'LUMEN_URI', get_template_directory_uri() );

require_once LUMEN_DIR . '/inc/setup.php';
require_once LUMEN_DIR . '/inc/template-tags.php';
require_once LUMEN_DIR . '/inc/comments.php';
