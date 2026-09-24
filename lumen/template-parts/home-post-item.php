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

// ~30 words of summary, controlled only on the homepage output.
$excerpt = wp_trim_words( get_the_excerpt(), 30, '…' );
$excerpt = trim( $excerpt );
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
