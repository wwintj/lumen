<?php
/**
 * Lumen — homepage post item (date + categories, title, excerpt only).
 *
 * Renders ONE post for the Blog Home ( latest posts only ).
 * Output:
 *   DATE · CATEGORY
 *   TITLE
 *   EXCERPT
 *
 * No featured image, no author, no comments, no "Read more".
 * Reuses the shared date / category helpers ( lumen_post_date(),
 * lumen_post_categories() ). Expected to run inside the main have_posts()
 * loop; early-returns when no post id is available.
 *
 * @package lumen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Homepage-only excerpt: CJK ~80 chars / Latin ~24 words, trimmed in
// template-tags.php (lumen_home_excerpt()) so Single/Archive/Search excerpts are untouched.
$excerpt = lumen_home_excerpt();
?>
<article class="lumen-home-post">
	<p class="lumen-home-meta">
		<?php lumen_post_date(); ?>
		<?php lumen_post_categories(); ?>
	</p>

	<h2 class="lumen-home-title">
		<a href="<?php echo esc_url( get_the_permalink() ); ?>">
			<?php echo esc_html( get_the_title() ); ?>
		</a>
	</h2>

	<?php if ( '' !== $excerpt ) : ?>
		<p class="lumen-home-excerpt">
			<?php echo esc_html( $excerpt ); ?>
		</p>
	<?php endif; ?>
</article>
