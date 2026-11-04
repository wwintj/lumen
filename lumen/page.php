<?php
/**
 * Lumen — static page template.
 *
 * @package lumen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<?php get_header(); ?>

<?php while ( have_posts() ) : the_post(); ?>
<article id="post-<?php the_ID(); ?>" class="lumen-page">
	<div class="lumen-page-wrap">
		<h1 class="lumen-page-title"><?php the_title(); ?></h1>

		<div class="lumen-page-body">
			<?php
			the_content();

			wp_link_pages( array(
				'before' => '<nav class="lumen-page-links" aria-label="' . esc_attr__( 'Page sections', 'lumen' ) . '">',
				'after'  => '</nav>',
			) );
			?>
		</div>
	</div>
</article>

<?php
// Pages get comments only when the editor turned Discussion on for that page
// (Core defaults pages to closed). inc/enqueue.php already loads Core's
// comment-reply script for this case, so the thread now actually renders.
if ( comments_open() || get_comments_number() ) {
	comments_template();
}
?>
<?php endwhile; ?>

<?php get_footer(); ?>
