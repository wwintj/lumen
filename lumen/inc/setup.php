<?php
/**
 * Lumen — theme setup.
 *
 * Registers theme supports, nav menus, sidebar, image sizes.
 * All public helpers are `lumen_`-prefixed to avoid global collisions.
 *
 * @package lumen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'lumen_setup' ) ) {
	add_action( 'after_setup_theme', 'lumen_setup' );

	function lumen_setup() {
		// --- Theme supports ----------------------------------------------
		add_theme_support( 'title-tag' );
		add_theme_support( 'post-thumbnails' );
		add_theme_support( 'automatic-feed-links' );
		add_theme_support( 'responsive-embeds' );
		add_theme_support( 'custom-logo', array(
			'height'      => 80,
			'width'       => 200,
			'thumbnail'   => false,
			'flex_height' => false,
			'flex_width'  => true,
		) );
		add_theme_support( 'align-wide' );

		add_theme_support( 'html5', array(
			'search-form',
			'nav',
			'comments',
			'gallery',
			'figure',
			'footnote',
			'section',
			'heading',
			'address',
			'header',
			'main',
			'aside',
			'footer',
			'article',
			'embeds',
		) );

		// --- Navigation menus --------------------------------------------
		register_nav_menus( array(
			'primary' => esc_html__( 'Primary menu', 'lumen' ),
			'footer'  => esc_html__( 'Footer menu', 'lumen' ),
		) );

		// --- Image sizes ---------------------------------------------------
		add_image_size( 'lumen-thumb', 640, 400, true );
		add_image_size( 'lumen-card', 800, 450, true );
		add_image_size( 'lumen-square', 640, 640, true );
	}
}

if ( ! function_exists( 'lumen_homeposts' ) ) {
	add_action( 'pre_get_posts', 'lumen_homeposts' );

	function lumen_homeposts( $query ) {
		// Homepage only: 8 posts per page.
		// Does not touch Archive, Search, Category, Tag, Author,
		// or the admin ( is_main_query() + is_home() ).
		if (
			! is_admin()
			&& $query->is_main_query()
			&& $query->is_home()
		) {
			$query->set( 'posts_per_page', 8 );
		}
	}
}
