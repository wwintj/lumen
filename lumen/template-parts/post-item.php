<?php
/**
 * Lumen — one post in a list: meta pills, title, excerpt.
 *
 * @package lumen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$lumen_excerpt = lumen_get_excerpt();
?>
<li id="post-<?php the_ID(); ?>" <?php post_class( 'lumen-post-item' ); ?>>
	<div class="lumen-meta">
		<?php if ( is_sticky() && is_home() && ! is_paged() ) : ?>
			<span class="lumen-pill lumen-pill--purple"><?php esc_html_e( 'Pinned', 'lumen' ); ?></span>
		<?php endif; ?>
		<?php lumen_the_date_pill(); ?>
		<?php lumen_the_category_pills(); ?>
	</div>
	<h2 class="lumen-post-item-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
	<?php if ( '' !== $lumen_excerpt ) : ?>
		<p class="lumen-post-item-excerpt"><?php echo esc_html( $lumen_excerpt ); ?></p>
	<?php endif; ?>
</li>
