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
	/**
	 * Render the native WordPress search form.
	 *
	 * WordPress search is a plain GET to the site root with the `s` query var,
	 * so this works with no JavaScript at all.
	 *
	 * The `$context` argument exists so that a page can legitimately contain
	 * more than one search form (e.g. the header form plus the form on the
	 * search results template) without emitting duplicate HTML `id` values,
	 * which would break both label association and ARIA references.
	 *
	 * Called with no argument it keeps emitting `lumen-search`, so existing
	 * call sites (search.php, 404.php) are unaffected.
	 *
	 * @param string $context Optional. 'default' or 'header'.
	 * @return void
	 */
	function lumen_search_form( $context = 'default' ) {
		$is_header = ( 'header' === $context );

		// Unique, predictable IDs per context. The form element itself gets
		// no id: the baseline markup never had one, and reusing the input's
		// id on the form would create a duplicate id in the same document.
		$input_id = $is_header ? 'lumen-header-search-input' : 'lumen-search';
		$label_id = $is_header ? 'lumen-header-search-label' : 'lumen-search-label';

		// Distinct modifier class so header styling stays scoped.
		$form_class = $is_header
			? 'lumen-search-form lumen-header-search'
			: 'lumen-search-form';

		// The header form is a compact landmark; the in-page form is not.
		$aria_label = $is_header
			? ' aria-label="' . esc_attr__( 'Site search', 'lumen' ) . '"'
			: '';

		echo '<form role="search" method="get" action="' . esc_url( home_url( '/' ) ) . '" class="' . esc_attr( $form_class ) . '"' . $aria_label . '>';
		echo '<label id="' . esc_attr( $label_id ) . '" for="' . esc_attr( $input_id ) . '" class="visually-hidden">' . esc_html__( 'Search', 'lumen' ) . '</label>';
		echo '<input id="' . esc_attr( $input_id ) . '" name="s" type="search" class="lumen-search-input" value="' . esc_attr( get_query_var( 's' ) ) . '" autocomplete="off">';

		if ( $is_header ) {
			// The submit control is icon-only; the visually-hidden text carries
			// the accessible name, so the SVG stays decorative.
			echo '<button type="submit" class="lumen-search-button">';
			echo lumen_search_icon_svg();
			echo '<span class="visually-hidden">' . esc_html__( 'Search', 'lumen' ) . '</span>';
			echo '</button>';
		} else {
			echo '<button type="submit" class="lumen-search-button">' . esc_html__( 'Search', 'lumen' ) . '</button>';
		}

		echo '</form>';
	}
}

if ( ! function_exists( 'lumen_search_icon_svg' ) ) {
	/**
	 * Return the decorative inline magnifier SVG.
	 *
	 * Inline (not an icon font, not an external file) so the theme keeps its
	 * zero-extra-request policy. Marked aria-hidden/focusable="false" because
	 * it is always paired with a text accessible name.
	 *
	 * @return string Raw SVG markup (safe: static, no user input).
	 */
	function lumen_search_icon_svg() {
		return '<svg class="lumen-search-icon" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">'
			. '<circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" stroke-width="1.5"/>'
			. '<line x1="10.5" y1="10.5" x2="14.5" y2="14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'
			. '</svg>';
	}
}
