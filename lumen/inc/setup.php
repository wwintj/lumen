<?php
/**
 * Lumen — theme setup and assets.
 *
 * @package lumen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Theme supports, menus and translations.
 */
function lumen_setup() {
	load_theme_textdomain( 'lumen', LUMEN_DIR . '/languages' );

	add_theme_support( 'title-tag' );
	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'align-wide' );
	add_theme_support(
		'custom-logo',
		array(
			'height'      => 80,
			'width'       => 200,
			'flex_height' => true,
			'flex_width'  => true,
		)
	);
	add_theme_support(
		'html5',
		array(
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
			'style',
			'script',
			'navigation-widgets',
		)
	);

	register_nav_menus(
		array(
			'primary' => __( 'Primary menu', 'lumen' ),
			'footer'  => __( 'Footer menu', 'lumen' ),
		)
	);
}
add_action( 'after_setup_theme', 'lumen_setup' );

/**
 * Stylesheet, plus Core's comment-reply script where threaded replies exist.
 *
 * The theme ships no JavaScript of its own.
 */
function lumen_enqueue_assets() {
	wp_enqueue_style( 'lumen', LUMEN_URI . '/assets/css/main.css', array(), LUMEN_VERSION );

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'lumen_enqueue_assets' );

/**
 * Browser UI colour for light and dark schemes.
 */
function lumen_theme_color_meta() {
	echo '<meta name="theme-color" content="#fdfdfd" media="(prefers-color-scheme: light)">' . "\n";
	echo '<meta name="theme-color" content="#161718" media="(prefers-color-scheme: dark)">' . "\n";
}
add_action( 'wp_head', 'lumen_theme_color_meta', 2 );
