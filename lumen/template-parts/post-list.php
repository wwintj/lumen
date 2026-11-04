<?php
/**
 * Lumen — the main query as a post list, with pagination or an empty state.
 *
 * @package lumen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( have_posts() ) : ?>
	<ul class="lumen-post-list">
		<?php
		while ( have_posts() ) :
			the_post();
			get_template_part( 'template-parts/post-item' );
		endwhile;
		?>
	</ul>
	<?php
	lumen_the_posts_pagination();
else :
	?>
	<p class="lumen-empty">
		<?php
		if ( is_search() ) {
			esc_html_e( 'Nothing matched your search. Try different words.', 'lumen' );
		} else {
			esc_html_e( 'No posts yet.', 'lumen' );
		}
		?>
	</p>
	<?php
endif;
