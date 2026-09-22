<?php
/**
 * Lumen — template tags.
 *
 * Small, composable output helpers for the loop. All `lumen_`-prefixed.
 * These run in the main query loop context (the_post() already called).
 *
 * @package lumen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'lumen_post_date' ) ) {
	/**
	 * Outputs the post date as a <time> element.
	 */
	function lumen_post_date() {
		$format = (string) get_option( 'date_format' );
		if ( '' === $format ) {
			$format = 'F j, Y';
		}
		// Version-robust date output: this WP version changed get_post_time() to
		// ( $format, $gmt, $post, $translate ); the old ( $timestamp, $format )
		// call is incompatible and yielded epoch dates. Use stable functions instead.
		$post_id       = (int) get_the_ID();
		$display_date  = (string) get_the_date( $format, $post_id );
		$post_date_gmt = (string) get_post_field( 'post_date_gmt', $post_id );
		$epoch         = $post_date_gmt ? (int) strtotime( $post_date_gmt ) : 0;
		$datetime      = gmdate( 'c', $epoch );
		echo '<time class="lumen-post-date" datetime="' . esc_attr( $datetime ) . '">' . esc_html( $display_date ) . '</time>';
	}
}

if ( ! function_exists( 'lumen_post_meta' ) ) {
	/**
	 * Outputs author + date (used in the single post header).
	 */
	function lumen_post_meta() {
		$author_id = (int) get_the_author_meta( 'ID' );
		if ( $author_id ) {
			$name = (string) get_the_author_meta( 'display_name' );
			$link = (string) get_author_posts_url( $author_id );
			if ( $name !== '' && $link !== '' ) {
				echo '<a class="lumen-post-author" href="' . esc_url( $link ) . '">' . esc_html( $name ) . '</a>';
			}
		}

		lumen_post_date();
	}
}

if ( ! function_exists( 'lumen_post_categories' ) ) {
	/**
	 * Outputs category links for the current post (or $post_id).
	 *
	 * @param int|null $post_id
	 */
	function lumen_post_categories( $post_id = null ) {
		$post_id = $post_id ? (int) $post_id : (int) get_the_ID();
		if ( ! $post_id ) {
			return;
		}
		// wp_get_post_terms() may return WP_Term objects or term IDs depending on
		// version/args; normalize to WP_Term objects before output.
		$terms = wp_get_post_terms( $post_id, 'category' );
		if ( ! is_array( $terms ) || empty( $terms ) ) {
			return;
		}
		$render_terms = array();
		foreach ( $terms as $term ) {
			if ( $term instanceof WP_Term ) {
				$render_terms[] = $term;
			} else {
				$t = get_term( (int) $term, 'category' );
				if ( $t instanceof WP_Term ) {
					$render_terms[] = $t;
				}
			}
		}
		if ( empty( $render_terms ) ) {
			return;
		}
		echo '<span class="lumen-post-cats">';
		foreach ( $render_terms as $term ) {
			$name = (string) $term->name;
			if ( '' === $name ) {
				continue;
			}
			// $term->link is unreliable in some WP versions/contexts (empty),
			// which caused categories to be silently dropped. Generate the
			// archive link via core, falling back to a slug-based URL.
			$term_id = $term instanceof WP_Term ? (int) $term->ID : 0;
			$link    = '' ;
			if ( $term_id ) {
				$link = (string) get_term_link( $term_id, 'category' );
			}
			if ( '' === $link ) {
				$link = (string) get_term_link( $term, 'category' );
			}
			if ( '' === $link ) {
				$slug = isset( $term->slug ) ? (string) $term->slug : '';
				if ( '' !== $slug ) {
					$link = home_url( '/?' . 'category_name=' . rawurlencode( $slug ) );
				}
			}
			if ( '' === $link ) {
				echo '<span class="lumen-post-cat">' . esc_html( $name ) . '</span>';
			} else {
				echo '<a class="lumen-post-cat" href="' . esc_url( $link ) . '">' . esc_html( $name ) . '</a>';
			}
		}
		echo '</span>';
	}
}
