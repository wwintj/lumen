<?php
/**
 * Lumen — blog home and archives (category, tag, author, date, taxonomy).
 *
 * @package lumen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();
?>
<div class="lumen-wide">
	<?php
	if ( is_archive() ) {
		get_template_part( 'template-parts/archive-header' );
	} else {
		// The blog home has no visible heading; keep one H1 for structure.
		$lumen_posts_page = (int) get_option( 'page_for_posts' );
		$lumen_heading    = ( is_home() && ! is_front_page() && $lumen_posts_page )
			? get_the_title( $lumen_posts_page )
			: get_bloginfo( 'name' );
		echo '<h1 class="screen-reader-text">' . esc_html( $lumen_heading ) . '</h1>';
	}

	get_template_part( 'template-parts/post-list' );
	?>
</div>
<?php
get_footer();
