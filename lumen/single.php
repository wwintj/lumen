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

		<!--
			Meta: grey date pill + green category pill(s), the same pill
			language as the Blog Home / archive / search list meta. There is
			deliberately no separator glyph between them — the original
			middle dot was removed in v1.1.15 (it was drawn by CSS on
			.lumen-single-meta .lumen-post-cats::before).
		-->
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
	/*
	 * Core the_post_navigation() still resolves the neighbouring posts, the
	 * direction and the URLs; only the visible text changes.
	 *
	 * The arrow is a CSS pseudo-element on the <a>, so the whole pill is
	 * clickable and the glyph is decorative. %title stays in the markup but is
	 * visually hidden: screen readers get "Previous post: <title>", while the
	 * page shows only the arrow. Core escapes %title in context.
	 */
	the_post_navigation( array(
		'prev_text' => '<span class="visually-hidden">' . esc_html__( 'Previous post', 'lumen' ) . ': %title</span>',
		'next_text' => '<span class="visually-hidden">' . esc_html__( 'Next post', 'lumen' ) . ': %title</span>',
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
