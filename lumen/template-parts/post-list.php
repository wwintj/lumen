<?php
/**
 * Lumen — post list (loop + pagination + empty state).
 *
 * Intended for the main query. Call via get_template_part() from a
 * template that has already set up the header context.
 *
 * @package lumen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<?php if ( have_posts() ) : ?>
	<ul class="lumen-post-list">
		<?php
		while ( have_posts() ) :
			the_post();
			get_template_part( 'template-parts/post-list-item' );
		endwhile;
		?>
	</ul>
	<?php lumen_pagination(); ?>
<?php else : ?>
	<p class="lumen-archive-empty">
		<?php echo esc_html__( 'No posts found.', 'lumen' ); ?>
	</p>
<?php endif; ?>
