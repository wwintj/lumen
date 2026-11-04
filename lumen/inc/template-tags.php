<?php
/**
 * Lumen — template tags.
 *
 * Small, composable output helpers for the loop. All `lumen_`-prefixed.
 * These run in the loop context (the_post() already called).
 *
 * @package lumen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'lumen_post_date' ) ) {
	/**
	 * Outputs the post date as a <time> element.
	 *
	 * Both values come from get_the_date(), which formats the local post_date
	 * in the site timezone. The previous implementation parsed post_date_gmt,
	 * which is '0000-00-00 00:00:00' for drafts and therefore produced a
	 * bogus machine-readable datetime in previews.
	 */
	function lumen_post_date() {
		$display_date = (string) get_the_date();
		$datetime     = (string) get_the_date( DATE_W3C );
		if ( '' === $display_date ) {
			return;
		}
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
	 * Uses get_the_category() (object-cached, filtered) and get_category_link().
	 * The previous version read the non-existent WP_Term::$ID property (a PHP
	 * warning on every pill) and cast get_term_link() to string, which is a
	 * fatal error whenever it returns a WP_Error.
	 *
	 * @param int|null $post_id
	 */
	function lumen_post_categories( $post_id = null ) {
		$terms = get_the_category( $post_id ? (int) $post_id : false );
		if ( empty( $terms ) ) {
			return;
		}

		$items = array();
		foreach ( $terms as $term ) {
			$name = (string) $term->name;
			if ( '' === $name ) {
				continue;
			}
			$link = get_category_link( $term );
			if ( '' === $link ) {
				$items[] = '<span class="lumen-post-cat">' . esc_html( $name ) . '</span>';
			} else {
				$items[] = '<a class="lumen-post-cat" href="' . esc_url( $link ) . '">' . esc_html( $name ) . '</a>';
			}
		}

		if ( $items ) {
			echo '<span class="lumen-post-cats">' . implode( '', $items ) . '</span>';
		}
	}
}

if ( ! function_exists( 'lumen_home_excerpt' ) ) {
	/**
	 * Returns a trimmed excerpt for the Blog Home only.
	 *
	 * CJK (Chinese) text → up to 80 characters.
	 * Latin text          → up to 24 words.
	 *
	 * Only used by template-parts/home-post-item.php, so Single/Archive/
	 * Search excerpts are untouched.
	 *
	 * @return string
	 */
	function lumen_home_excerpt() {
		$raw  = (string) get_the_excerpt();
		$text = trim( wp_strip_all_tags( $raw ) );
		if ( '' === $text ) {
			return '';
		}
		if ( preg_match( '/[\p{Han}]/u', $text ) ) {
			// Chinese: cut to ~80 characters.
			$max   = 80;
			$chars = preg_split( '//u', $text, -1, PREG_SPLIT_NO_EMPTY );
			$kept  = array_slice( $chars, 0, $max );
			$out   = implode( '', $kept );
			if ( count( $chars ) > $max ) {
				$out .= '…';
			}
			return $out;
		}
		// Latin: cut to ~24 words.
		return wp_trim_words( $text, 24, '…' );
	}
}

if ( ! function_exists( 'lumen_list_excerpt' ) ) {
	/**
	 * Returns a trimmed excerpt for archive/search lists.
	 *
	 * Archive: CJK 68 chars / Latin 22 words.
	 * Search:  CJK 92 chars / Latin 28 words.
	 * Ellipsis: U+2026.
	 *
	 * @param string $context 'archive' | 'search'.
	 * @return string
	 */
	function lumen_list_excerpt( $context = 'archive' ) {
		$raw  = (string) get_the_excerpt();
		$text = trim( wp_strip_all_tags( $raw ) );
		if ( '' === $text ) {
			return '';
		}
		if ( preg_match( '/[\p{Han}]/u', $text ) ) {
			$max   = ( 'search' === $context ) ? 92 : 68;
			$chars = preg_split( '//u', $text, -1, PREG_SPLIT_NO_EMPTY );
			$kept  = array_slice( $chars, 0, $max );
			$out   = implode( '', $kept );
			if ( count( $chars ) > $max ) {
				$out .= '…';
			}
			return $out;
		}
		// Latin: word count.
		return wp_trim_words( $text, ( 'search' === $context ) ? 28 : 22, '…' );
	}
}

if ( ! function_exists( 'lumen_archive_title' ) ) {
	/**
	 * Returns the clean archive H1 title (no "Category:" / "Tag:" prefix).
	 *
	 * Derived from the queried object, so every standard archive type is
	 * covered by core APIs:
	 *   - WP_Term     → term name (category / tag / any public custom taxonomy)
	 *   - WP_User     → display name (author archive)
	 *   - WP_Post_Type → post-type label (post-type archive)
	 *   - date archive → localized year / month / day via wp_date()
	 * Falls back to core get_the_archive_title() (string return, no echo
	 * side-effect) for any other archive type.
	 *
	 * @return string
	 */
	function lumen_archive_title() {
		$object = get_queried_object();

		// Term archives (category / tag / any public custom taxonomy).
		if ( $object instanceof WP_Term ) {
			$name = (string) $object->name;
			if ( '' !== $name ) {
				return esc_html( $name );
			}
		}

		// Author archives.
		if ( is_author() && $object instanceof WP_User ) {
			$name = (string) $object->display_name;
			if ( '' !== $name && '0' !== $name ) {
				return esc_html( $name );
			}
		}

		// Post-type archives.
		if ( is_post_type_archive() && $object instanceof WP_Post_Type ) {
			$label = (string) $object->label;
			if ( '' !== $label ) {
				return esc_html( $label );
			}
		}

		// Date archives (year / month / day), localized via wp_date().
		// Timestamps are built and formatted in UTC so the site timezone can
		// never shift the label to the neighbouring day/month/year.
		if ( is_date() ) {
			$year     = (int) get_query_var( 'year' );
			$monthnum = (int) get_query_var( 'monthnum' );
			$day      = (int) get_query_var( 'day' );
			$utc      = new DateTimeZone( 'UTC' );
			if ( $year > 0 && 0 === $monthnum && 0 === $day ) {
				return esc_html( wp_date( _x( 'Y', 'yearly archives date format', 'lumen' ), gmmktime( 12, 0, 0, 1, 1, $year ), $utc ) );
			}
			if ( $year > 0 && $monthnum > 0 && 0 === $day ) {
				return esc_html( wp_date( _x( 'F Y', 'monthly archives date format', 'lumen' ), gmmktime( 12, 0, 0, $monthnum, 1, $year ), $utc ) );
			}
			if ( $year > 0 && $monthnum > 0 && $day > 0 ) {
				return esc_html( wp_date( (string) get_option( 'date_format', 'F j, Y' ), gmmktime( 12, 0, 0, $monthnum, $day, $year ), $utc ) );
			}
		}

		// Fallback: core archive title (returns a string; no echo side effect).
		// get_the_archive_title() wraps its prefix in a <span>; strip markup
		// so it is not printed as literal "<span>" text after escaping.
		$title = trim( wp_strip_all_tags( (string) get_the_archive_title() ) );
		if ( '' !== $title ) {
			return esc_html( $title );
		}

		return '';
	}
}

if ( ! function_exists( 'lumen_archive_context_label' ) ) {
	/**
	 * Returns the localized archive context line, e.g. "Category · 14 posts",
	 * "Author · 3 posts", "0 posts", etc. Always shows the post count
	 * (localized plural) even when it is 0.
	 *
	 * @param int $count Number of found posts (defaults to current $wp_query count).
	 * @return string
	 */
	function lumen_archive_context_label( $count = null ) {
		$found = (int) ( $GLOBALS['wp_query']->found_posts ?? 0 );
		$count = null !== $count ? (int) $count : $found;
		$count_text = lumen_posts_count_label( $count );

		$object = get_queried_object();

		// Term archives (category / tag / any public custom taxonomy).
		if ( $object instanceof WP_Term && ! empty( $object->taxonomy ) ) {
			$singular = '';
			$tax      = get_taxonomy( $object->taxonomy );
			if ( is_object( $tax ) && ! empty( $tax->labels->singular_name ) ) {
				$singular = (string) $tax->labels->singular_name;
			}
			if ( '' !== $singular ) {
				return $singular . ' · ' . $count_text;
			}
			// Fallback to core category / tag labels (localized).
			if ( is_category() ) {
				return __( 'Category', 'lumen' ) . ' · ' . $count_text;
			}
			if ( is_tag() ) {
				return __( 'Tag', 'lumen' ) . ' · ' . $count_text;
			}
			return $count_text;
		}

		// Author archives.
		if ( is_author() ) {
			return __( 'Author', 'lumen' ) . ' · ' . $count_text;
		}

		// Date archives: only the localized count ("N posts").
		if ( is_date() ) {
			return $count_text;
		}

		// Post-type archives: only the localized count ("N posts").
		if ( is_post_type_archive() ) {
			return $count_text;
		}

		return '';
	}
}

if ( ! function_exists( 'lumen_archive_term_description' ) ) {
	/**
	 * Returns the queried term description (escaped with wp_kses_post()),
	 * empty when absent.
	 *
	 * Works for any public term archive (category / tag / custom taxonomy)
	 * by reading the description from the queried object, which is a
	 * standard WordPress Core API.
	 *
	 * @return string
	 */
	function lumen_archive_term_description() {
		$object = get_queried_object();
		if ( ! ( $object instanceof WP_Term ) ) {
			return '';
		}
		$description = (string) $object->description;
		if ( '' === $description ) {
			return '';
		}
		return wp_kses_post( $description );
	}
}

if ( ! function_exists( 'lumen_posts_count_label' ) ) {
	/**
	 * Returns the localized post count label, e.g. "1 post", "0 posts", "14 posts".
	 *
	 * Built with _n() + number_format_i18n() — never a hardcoded "posts".
	 *
	 * @param int $count
	 * @return string
	 */
	function lumen_posts_count_label( $count ) {
		$count = (int) $count;
		/* translators: %s: number of posts. */
		return sprintf( _n( '%s post', '%s posts', $count, 'lumen' ), number_format_i18n( $count ) );
	}
}

if ( ! function_exists( 'lumen_search_results_label' ) ) {
	/**
	 * Returns the localized search results count, e.g.
	 * "0 results for 'query'", "1 result for 'query'", "14 results for 'query'".
	 *
	 * Always shows the count (including 0). The query value is escaped
	 * exactly once (esc_html) — no double-escape.
	 *
	 * @param int    $count Number of results.
	 * @param string $query The search query string.
	 * @return string
	 */
	function lumen_search_results_label( $count, $query ) {
		$count = (int) $count;
		return esc_html(
			sprintf(
				/* translators: 1: number of results, 2: search query. */
				_n( "%1\$s result for '%2\$s'", "%1\$s results for '%2\$s'", $count, 'lumen' ),
				number_format_i18n( $count ),
				$query
			)
		);
	}
}

if ( ! function_exists( 'lumen_list_meta' ) ) {
	/**
	 * Outputs the list meta for archive / search items: post date + categories.
	 *
	 * Uses the shared lumen_post_date() and lumen_post_categories() helpers
	 * (date + categories, no author). The "·" separator is rendered by CSS
	 * ::before on the categories span, so it appears only when categories
	 * render (never an orphan dot).
	 *
	 * @return void
	 */
	function lumen_list_meta() {
		// Wrap the date + categories in one meta block so the list-item meta
		// styles apply in both archive and search contexts.
		echo '<p class="lumen-post-meta">';
		lumen_post_date();
		lumen_post_categories();
		echo '</p>';
	}
}
