<?php
/**
 * Lumen — template tags.
 *
 * Small output helpers used by the templates. Functions that print start
 * with `lumen_the_`/`lumen_render_`; the rest return values.
 *
 * @package lumen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Print a registered nav menu, or nothing when the location is empty.
 *
 * @param string $location Menu location slug.
 */
function lumen_render_nav( $location ) {
	if ( ! has_nav_menu( $location ) ) {
		return;
	}
	wp_nav_menu(
		array(
			'theme_location' => $location,
			'container'      => false,
			'menu_class'     => 'lumen-menu',
			'depth'          => 1,
			'fallback_cb'    => false,
		)
	);
}

/**
 * Small decorative line icons (inline SVG, 20×20 grid, currentColor).
 *
 * Always paired with visible or screen-reader text, so they are aria-hidden.
 *
 * @param string $name search | time | comment | user | calendar | home.
 * @return string SVG markup.
 */
function lumen_icon( $name ) {
	$paths = array(
		'search'   => '<circle cx="8.5" cy="8.5" r="5.5"/><path d="M12.6 12.6 17.5 17.5"/>',
		'time'     => '<path d="M5 2.5h10M5 17.5h10M6 2.5c0 4 8 5 8 7.5s-8 3.5-8 7.5M14 2.5c0 4-8 5-8 7.5s8 3.5 8 7.5"/>',
		'comment'  => '<path d="M10 3.5c4.1 0 7 2.5 7 5.6s-2.9 5.6-7 5.6c-.9 0-1.7-.1-2.5-.3L4 16.5l.9-3C3.7 12.5 3 11 3 9.1 3 6 5.9 3.5 10 3.5Z"/>',
		'user'     => '<circle cx="10" cy="6.5" r="3.5"/><path d="M3.5 17.5c.6-3.4 3.2-5.5 6.5-5.5s5.9 2.1 6.5 5.5"/>',
		'calendar' => '<rect x="3" y="4.5" width="14" height="12.5" rx="1.5"/><path d="M3 8.5h14M7 2.5v4M13 2.5v4"/>',
		'home'     => '<path d="M3 9.2 10 3.5l7 5.7V17a.5.5 0 0 1-.5.5H12.5v-5h-5v5H3.5A.5.5 0 0 1 3 17V9.2Z"/>',
	);
	if ( ! isset( $paths[ $name ] ) ) {
		return '';
	}
	return '<svg class="lumen-icon lumen-icon--' . esc_attr( $name ) . '" viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'
		. $paths[ $name ]
		. '</svg>';
}

/**
 * Print the search form.
 *
 * @param string $context 'page' or 'popover' (the header dropdown; autofocuses).
 */
function lumen_search_form( $context = 'page' ) {
	$is_popover = ( 'popover' === $context );
	$input_id   = $is_popover ? 'lumen-search-popover-input' : 'lumen-search-input';
	?>
	<form role="search" method="get" class="lumen-search-form lumen-search-form--<?php echo esc_attr( $context ); ?>" action="<?php echo esc_url( home_url( '/' ) ); ?>">
		<label class="screen-reader-text" for="<?php echo esc_attr( $input_id ); ?>"><?php esc_html_e( 'Search', 'lumen' ); ?></label>
		<input
			type="search"
			id="<?php echo esc_attr( $input_id ); ?>"
			class="lumen-search-input"
			name="s"
			value="<?php echo esc_attr( get_search_query() ); ?>"
			placeholder="<?php esc_attr_e( 'Search posts…', 'lumen' ); ?>"
			autocomplete="off"
			<?php echo $is_popover ? 'autofocus' : ''; ?>
		>
		<button type="submit" class="lumen-search-submit"><?php esc_html_e( 'Search', 'lumen' ); ?></button>
	</form>
	<?php
}

/**
 * Print the post's categories as outlined accent pills.
 */
function lumen_the_category_pills() {
	$categories = get_the_category();
	if ( empty( $categories ) ) {
		return;
	}
	foreach ( $categories as $category ) {
		printf(
			'<a class="lumen-pill lumen-pill--accent" href="%1$s">%2$s</a>',
			esc_url( get_category_link( $category ) ),
			esc_html( $category->name )
		);
	}
}

/**
 * Print the post's tags as a list of pills.
 */
function lumen_the_tag_list() {
	$tags = get_the_tags();
	if ( empty( $tags ) || is_wp_error( $tags ) ) {
		return;
	}
	echo '<ul class="lumen-tags" aria-label="' . esc_attr__( 'Tags', 'lumen' ) . '">';
	foreach ( $tags as $tag ) {
		printf(
			'<li><a class="lumen-pill" href="%1$s">#%2$s</a></li>',
			esc_url( get_tag_link( $tag ) ),
			esc_html( $tag->name )
		);
	}
	echo '</ul>';
}

/**
 * Estimated reading time in minutes.
 *
 * CJK text is counted per character (~400/min), everything else per word
 * (~220/min), so mixed Chinese/English posts get a sensible estimate.
 *
 * @param int|WP_Post|null $post Post.
 * @return int
 */
function lumen_reading_minutes( $post = null ) {
	$post = get_post( $post );
	if ( ! $post ) {
		return 0;
	}
	$text = wp_strip_all_tags( strip_shortcodes( $post->post_content ) );
	$text = html_entity_decode( $text, ENT_QUOTES, 'UTF-8' );

	$cjk   = (int) preg_match_all( '/[\p{Han}\p{Hiragana}\p{Katakana}\p{Hangul}]/u', $text );
	$rest  = preg_replace( '/[\p{Han}\p{Hiragana}\p{Katakana}\p{Hangul}]/u', ' ', $text );
	$words = (int) preg_match_all( '/[\p{L}\p{N}]+/u', (string) $rest );

	return max( 1, (int) round( $cjk / 400 + $words / 220 ) );
}

/**
 * Localised short reading time, e.g. "3 min".
 *
 * @return string
 */
function lumen_reading_time_short() {
	$minutes = lumen_reading_minutes();
	return sprintf(
		/* translators: %s: number of minutes. */
		_n( '%s min', '%s min', $minutes, 'lumen' ),
		number_format_i18n( $minutes )
	);
}

/**
 * Print the meta row: date · reading time · comments (icons + text).
 *
 * Used on post cards and in the single post header.
 */
function lumen_the_post_meta() {
	$comments = (int) get_comments_number();
	?>
	<div class="lumen-post-meta">
		<time class="lumen-stat" datetime="<?php echo esc_attr( get_the_date( DATE_W3C ) ); ?>">
			<?php echo lumen_icon( 'calendar' ); // phpcs:ignore WordPress.Security.EscapeOutput -- static SVG. ?>
			<?php echo esc_html( get_the_date() ); ?>
		</time>
		<span class="lumen-stat">
			<?php echo lumen_icon( 'time' ); // phpcs:ignore WordPress.Security.EscapeOutput -- static SVG. ?>
			<?php echo esc_html( lumen_reading_time_short() ); ?>
		</span>
		<?php if ( comments_open() || $comments ) : ?>
			<a class="lumen-stat" href="<?php echo esc_url( is_singular() ? '#comments' : get_comments_link() ); ?>">
				<?php echo lumen_icon( 'comment' ); // phpcs:ignore WordPress.Security.EscapeOutput -- static SVG. ?>
				<?php echo esc_html( number_format_i18n( $comments ) ); ?>
				<span class="screen-reader-text"><?php esc_html_e( 'comments', 'lumen' ); ?></span>
			</a>
		<?php endif; ?>
	</div>
	<?php
}

/**
 * Print a breadcrumb trail for archive and search pages.
 *
 * Home / [parent categories /] current. Tags, authors and dates get a
 * plain-text type label in the middle (e.g. Home / Tags / design).
 */
function lumen_the_breadcrumbs() {
	$items  = array( array( __( 'Home', 'lumen' ), home_url( '/' ) ) );
	$object = get_queried_object();

	if ( is_category() && $object instanceof WP_Term ) {
		foreach ( array_reverse( get_ancestors( $object->term_id, 'category', 'taxonomy' ) ) as $ancestor_id ) {
			$ancestor = get_term( $ancestor_id, 'category' );
			if ( $ancestor instanceof WP_Term ) {
				$items[] = array( $ancestor->name, get_category_link( $ancestor ) );
			}
		}
		$items[] = array( $object->name, '' );
	} elseif ( is_tag() && $object instanceof WP_Term ) {
		$items[] = array( __( 'Tags', 'lumen' ), '' );
		$items[] = array( $object->name, '' );
	} elseif ( is_tax() && $object instanceof WP_Term ) {
		$taxonomy = get_taxonomy( $object->taxonomy );
		if ( $taxonomy ) {
			$items[] = array( $taxonomy->labels->name, '' );
		}
		$items[] = array( $object->name, '' );
	} elseif ( is_author() && $object instanceof WP_User ) {
		$items[] = array( __( 'Author', 'lumen' ), '' );
		$items[] = array( $object->display_name, '' );
	} elseif ( is_date() ) {
		$year = (int) get_query_var( 'year' );
		if ( is_month() || is_day() ) {
			$items[] = array( (string) $year, get_year_link( $year ) );
		}
		$items[] = array( lumen_get_archive_title(), '' );
	} elseif ( is_search() ) {
		$items[] = array( __( 'Search', 'lumen' ), '' );
	} elseif ( is_post_type_archive() ) {
		$items[] = array( lumen_get_archive_title(), '' );
	}

	$last = count( $items ) - 1;
	echo '<nav class="lumen-breadcrumbs" aria-label="' . esc_attr__( 'Breadcrumb', 'lumen' ) . '"><ol>';
	foreach ( $items as $i => $item ) {
		list( $label, $url ) = $item;
		$icon = ( 0 === $i ) ? lumen_icon( 'home' ) : '';
		if ( $i === $last ) {
			echo '<li><span aria-current="page">' . esc_html( $label ) . '</span></li>';
		} elseif ( '' !== $url ) {
			echo '<li><a href="' . esc_url( $url ) . '">' . $icon . esc_html( $label ) . '</a></li>'; // phpcs:ignore WordPress.Security.EscapeOutput -- static SVG icon.
		} else {
			echo '<li><span>' . esc_html( $label ) . '</span></li>';
		}
	}
	echo '</ol></nav>';
}

/**
 * Trimmed plain-text excerpt: CJK by characters, other text by words.
 *
 * @param int $cjk_chars Max CJK characters.
 * @param int $words     Max words for non-CJK text.
 * @return string Plain text (not escaped).
 */
function lumen_get_excerpt( $cjk_chars = 90, $words = 30 ) {
	if ( post_password_required() ) {
		return '';
	}
	// A hand-written excerpt is used as written (only trimmed if too long).
	// Otherwise start from the content itself: Core's auto excerpt is already
	// cut by locale rules (very short for Chinese) and ends in " [&hellip;]".
	$source = has_excerpt()
		? get_the_excerpt()
		: excerpt_remove_blocks( strip_shortcodes( get_the_content( '' ) ) );
	$text   = trim( preg_replace( '/\s+/u', ' ', wp_strip_all_tags( (string) $source ) ) );
	$text = html_entity_decode( $text, ENT_QUOTES, 'UTF-8' );
	if ( '' === $text ) {
		return '';
	}
	if ( preg_match( '/\p{Han}/u', $text ) ) {
		if ( mb_strlen( $text ) > $cjk_chars ) {
			$text = rtrim( mb_substr( $text, 0, $cjk_chars ) ) . '…';
		}
		return $text;
	}
	return wp_trim_words( $text, $words, '…' );
}

/**
 * Archive heading text without Core's "Category:" style prefixes.
 *
 * @return string Plain text (not escaped).
 */
function lumen_get_archive_title() {
	$object = get_queried_object();

	if ( $object instanceof WP_Term ) {
		return $object->name;
	}
	if ( $object instanceof WP_User ) {
		return $object->display_name;
	}
	if ( $object instanceof WP_Post_Type ) {
		return $object->labels->name;
	}

	$utc = new DateTimeZone( 'UTC' );
	$y   = (int) get_query_var( 'year' );
	$m   = (int) get_query_var( 'monthnum' );
	$d   = (int) get_query_var( 'day' );
	if ( is_day() && $y && $m && $d ) {
		return wp_date( get_option( 'date_format' ), gmmktime( 12, 0, 0, $m, $d, $y ), $utc );
	}
	if ( is_month() && $y && $m ) {
		return wp_date( _x( 'F Y', 'monthly archives date format', 'lumen' ), gmmktime( 12, 0, 0, $m, 1, $y ), $utc );
	}
	if ( is_year() && $y ) {
		return wp_date( _x( 'Y', 'yearly archives date format', 'lumen' ), gmmktime( 12, 0, 0, 1, 1, $y ), $utc );
	}

	return wp_strip_all_tags( get_the_archive_title() );
}

/**
 * Localised "N posts" label.
 *
 * @param int $count Number of posts.
 * @return string
 */
function lumen_posts_count_label( $count ) {
	return sprintf(
		/* translators: %s: number of posts. */
		_n( '%s post', '%s posts', (int) $count, 'lumen' ),
		number_format_i18n( (int) $count )
	);
}

/**
 * Numbered pill pagination for post lists.
 */
function lumen_the_posts_pagination() {
	the_posts_pagination(
		array(
			'mid_size'           => 1,
			'prev_text'          => '<span aria-hidden="true">←</span><span class="screen-reader-text">' . esc_html__( 'Previous page', 'lumen' ) . '</span>',
			'next_text'          => '<span class="screen-reader-text">' . esc_html__( 'Next page', 'lumen' ) . '</span><span aria-hidden="true">→</span>',
			'before_page_number' => '<span class="screen-reader-text">' . esc_html__( 'Page', 'lumen' ) . ' </span>',
			'class'              => 'lumen-pagination',
		)
	);
}

/**
 * Print wp_link_pages() for posts split with <!--nextpage-->.
 */
function lumen_the_page_links() {
	wp_link_pages(
		array(
			'before' => '<nav class="lumen-page-links" aria-label="' . esc_attr__( 'Post pages', 'lumen' ) . '">',
			'after'  => '</nav>',
		)
	);
}

