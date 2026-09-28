<?php
/**
 * Lumen — template helper functions.
 *
 * All public helpers are `lumen_`-prefixed to avoid global collisions.
 * These are presentation helpers only; no business logic.
 *
 * @package lumen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'lumen_render_nav' ) ) {
	function lumen_render_nav( $location = 'primary' ) {
		if ( has_nav_menu( $location ) ) {
			wp_nav_menu( array(
				'location'  => $location,
				'menu_wrap' => '<ul class="lumen-nav-links">',
				'container' => false,
				'menu_class' => false,
			) );
		}
	}
}

if ( ! function_exists( 'lumen_footer_nav' ) ) {
	function lumen_footer_nav() {
		// Primary footer menu; no-op when unset.
		lumen_render_nav( 'footer' );
	}
}

if ( ! function_exists( 'lumen_pagination' ) ) {
	function lumen_pagination() {
		the_posts_pagination( array(
			'mid_size'  => 2,
			'prev_text' => esc_html__( 'Previous', 'lumen' ),
			'next_text' => esc_html__( 'Next', 'lumen' ),
			'class'     => 'lumen-pagination',
		) );
	}
}

if ( ! function_exists( 'lumen_search_form' ) ) {
	function lumen_search_form() {
		$query_arg = home_url( '/' );
		echo '<form role="search" method="get" action="' . esc_url( $query_arg ) . '" class="lumen-search-form">';
		echo '<label for="lumen-search" class="visually-hidden">' . esc_html__( 'Search', 'lumen' ) . '</label>';
		echo '<input id="lumen-search" name="s" type="search" class="lumen-search-input" value="' . esc_attr( get_query_var( 's' ) ) . '" autocomplete="off">';
		echo '<button type="submit" class="lumen-search-button">' . esc_html__( 'Search', 'lumen' ) . '</button>';
		echo '</form>';
	}
}
