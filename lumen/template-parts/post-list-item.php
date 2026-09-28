<?php
/**
 * Lumen — one post list item (shared by Archive and Search).
 *
 * Text-first item: no thumbnail.
 *
 * Archive: meta → title → excerpt.
 * Search:  title → meta → excerpt.
 *
 * Excerpt uses lumen_list_excerpt($context) for context-aware length.
 *
 * @package lumen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$context    = is_search() ? 'search' : 'archive';
$meta_first = ( 'archive' === $context );
$excerpt    = lumen_list_excerpt( $context );
?>
<li class="lumen-post-item">
	<article class="lumen-post-card">
		<?php if ( $meta_first ) : ?>
			<?php lumen_post_meta(); ?>
		<?php endif; ?>
		<h2 class="lumen-post-title">
			<a href="<?php the_permalink(); ?>">
				<?php the_title(); ?>
			</a>
		</h2>
		<?php if ( ! $meta_first ) : ?>
			<?php lumen_post_meta(); ?>
		<?php endif; ?>
		<?php if ( '' !== $excerpt ) : ?>
			<p class="lumen-post-excerpt">
				<?php echo esc_html( $excerpt ); ?>
			</p>
		<?php endif; ?>
	</article>
</li>
