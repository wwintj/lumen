<?php
/**
 * Lumen — single post template.
 *
 * @package lumen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<?php get_header(); ?>
<article class="lumen-post">
	<header class="lumen-post-header">
		<h1 class="lumen-post-title"><?php the_title(); ?></h1>

		<div class="lumen-single-meta">
			<?php lumen_post_date(); ?>
			<?php lumen_post_categories(); ?>
		</div>

		<?php
		if ( has_post_thumbnail() ) : ?>
			<div class="lumen-post-featured">
				<?php
				the_post_thumbnail( 'lumen-card', array( 'loading' => 'eager' ) );
				?>
			</div>
		<?php endif; ?>
	</header>

	<div class="lumen-post-body">
		<?php
		the_content();
		?>
	</div>
</article>

<!-- Previous / next post navigation. Core the_post_navigation() emits its own
     <nav> elements (with rel=prev/next and their own aria-labels); the
     <div class="lumen-post-nav"> is a layout container only — it is not a
     duplicate navigation element. -->
<div class="lumen-post-nav">
	<?php
	the_post_navigation( array(
		'prev_text' => '<span class="lumen-post-nav-label">← ' . esc_html__( 'Previous', 'lumen' ) . '</span><span class="lumen-post-nav-title">%title</span>',
		'next_text' => '<span class="lumen-post-nav-title">%title</span><span class="lumen-post-nav-label">' . esc_html__( 'Next', 'lumen' ) . ' →</span>',
	) );
	?>
</div>

<!-- Comments (Core). Standard loading pattern: comments_open() is a
     non-side-effecting bool conditional, so no comments_close() is needed;
     comments_template() includes the self-contained comments.php. -->
<?php
if ( comments_open() || get_comments_number() ) {
    comments_template();
}
?>

<?php get_footer(); ?>
