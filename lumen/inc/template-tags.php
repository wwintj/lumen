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
 * Inline magnifier icon (decorative).
 *
 * @return string
 */
function lumen_search_icon() {
	return '<svg class="lumen-icon" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false">'
		. '<circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" stroke-width="1.6"/>'
		. '<line x1="12.6" y1="12.6" x2="17.5" y2="17.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>'
		. '</svg>';
}

/**
 * Print the search form.
 *
 * @param string $context 'page' (with a submit button) or 'popover' (input only).
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
		<?php if ( ! $is_popover ) : ?>
			<button type="submit" class="lumen-button"><?php esc_html_e( 'Search', 'lumen' ); ?></button>
		<?php endif; ?>
	</form>
	<?php
}

/**
 * Print the post date as a pill.
 */
function lumen_the_date_pill() {
	printf(
		'<time class="lumen-pill" datetime="%1$s">%2$s</time>',
		esc_attr( get_the_date( DATE_W3C ) ),
		esc_html( get_the_date() )
	);
}

/**
 * Print the post's categories as green pills.
 */
function lumen_the_category_pills() {
	$categories = get_the_category();
	if ( empty( $categories ) ) {
		return;
	}
	foreach ( $categories as $category ) {
		printf(
			'<a class="lumen-pill lumen-pill--green" href="%1$s">%2$s</a>',
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
 * Print the reading time as a pill.
 */
function lumen_the_reading_time_pill() {
	$minutes = lumen_reading_minutes();
	printf(
		'<span class="lumen-pill">%s</span>',
		esc_html(
			sprintf(
				/* translators: %s: number of minutes. */
				_n( '%s min read', '%s min read', $minutes, 'lumen' ),
				number_format_i18n( $minutes )
			)
		)
	);
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
