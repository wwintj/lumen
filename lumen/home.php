<?php
/**
 * Lumen — Blog Home (latest posts only).
 *
 * Template hierarchy: used for the Blog Home ( is_home() ), whether the front
 * page displays the latest posts or a dedicated posts page is set. A quiet
 * "Latest" list with no featured images, sidebar, hero, or tag cloud.
 *
 * @package lumen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<?php get_header(); ?>

<section class="lumen-home-wrap">
	<?php if ( have_posts() ) : ?>

		<div class="lumen-home-list">
			<?php while ( have_posts() ) : the_post(); ?>
				<?php get_template_part( 'template-parts/home-post-item' ); ?>
			<?php endwhile; ?>
		</div>

		<nav class="lumen-home-pagination">
			<!-- Left: "Previous" = previous page (lower page number). Empty on page 1. -->
			<span class="lumen-home-pagination-left">
				<?php previous_posts_link( esc_html__( 'Previous', 'lumen' ) ); ?>
			</span>
			<!-- Right: "Next" = next page (higher page number). Empty on the last page. -->
			<span class="lumen-home-pagination-right">
				<?php next_posts_link( esc_html__( 'Next', 'lumen' ) ); ?>
			</span>
		</nav>

	<?php else : ?>

		<p class="lumen-archive-empty">
			<?php echo esc_html__( 'No posts found.', 'lumen' ); ?>
		</p>

	<?php endif; ?>
</section>

<?php get_footer(); ?>
