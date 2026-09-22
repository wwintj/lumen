<?php
/**
 * Lumen — asset enqueue.
 *
 * Enqueues the theme stylesheet. JS is not loaded: the navigation is a
 * no-JS, always-accessible horizontal list (see header.php).
 * Uses get_template_directory_uri() (no hardcoded URLs).
 *
 * @package lumen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'lumen_enqueue_assets' ) ) {
	add_action( 'wp_enqueue_scripts', 'lumen_enqueue_assets' );

	function lumen_enqueue_assets() {
		// Base theme stylesheet (style.css: design tokens, reset, typography).
		// Enqueued explicitly because this theme ships a theme.json, which
		// otherwise causes WP to skip the classic auto-load of style.css.
		wp_enqueue_style(
			'lumen-base',
			LUMEN_URI . '/style.css',
			array(),
			LUMEN_VERSION
		);
		// Component / layout styles (depend on the base for tokens + reset).
		wp_enqueue_style(
			'lumen-main',
			LUMEN_URI . '/assets/css/main.css',
			array( 'lumen-base' ),
			LUMEN_VERSION
		);
	}
}
