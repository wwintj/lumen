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

		<?php
		/*
		 * Arrow-only pills. Core previous_posts_link()/next_posts_link() still
		 * provide the URL and the "is there a target?" logic: on page 1 the
		 * previous call returns nothing, so the wrapper renders empty and CSS
		 * collapses it — no ghost pill, no orphaned arrow.
		 *
		 * The arrow glyph is a CSS pseudo-element on the <a> itself, so the whole
		 * pill is the click target and the glyph is decorative by nature. The
		 * accessible name comes from a visually-hidden translatable string, so
		 * the link is never an unnamed control.
		 */
		?>
		<nav class="lumen-home-pagination">
			<div class="lumen-pager lumen-pager-prev">
				<?php
				previous_posts_link(
					'<span class="visually-hidden">' . esc_html__( 'Previous page', 'lumen' ) . '</span>'
				);
				?>
			</div>
			<div class="lumen-pager lumen-pager-next">
				<?php
				next_posts_link(
					'<span class="visually-hidden">' . esc_html__( 'Next page', 'lumen' ) . '</span>'
				);
				?>
			</div>
		</nav>

	<?php else : ?>

		<p class="lumen-archive-empty">
			<?php echo esc_html__( 'No posts found.', 'lumen' ); ?>
		</p>

	<?php endif; ?>
</section>

<?php get_footer(); ?>
