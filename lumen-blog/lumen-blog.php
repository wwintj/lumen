<?php
/**
 * Plugin Name:       Lumen Blog
 * Plugin URI:        https://github.com/wwintj/lumen
 * Description:       Thin companion bootstrap for the Lumen theme. Ships no features;
 *                    future Lumen Blog extensions (CPTs, forms, REST API) plug in here.
 * Version:           0.1.0
 * Requires at least: 6.3
 * Requires PHP:      8.2
 * Author:            Lumen Team
 * Author URI:        https://github.com/wwintj
 * Text Domain:       lumen-blog
 * Domain Path:       /
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
define( 'LBN_VERSION', '0.1.0' );
define( 'LBN_TEXT_DOMAIN', 'lumen-blog' );

// Load the text domain so future extensions are i18n-ready.
add_action( 'init', 'lbn_load_textdomain' );
function lbn_load_textdomain() {
	load_plugin_textdomain( LBN_TEXT_DOMAIN, false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
}
