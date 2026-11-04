<?php
/**
 * Lumen — one post card in a list.
 *
 * Category pills · title · date + reading time + comments · excerpt ·
 * "Read more" button.
 *
 * @package lumen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$lumen_excerpt = lumen_get_excerpt();
?>
<li id="post-<?php the_ID(); ?>" <?php post_class( 'lumen-card' ); ?> style="--i: <?php echo (int) ( $args['index'] ?? 0 ); ?>">
	<div class="lumen-pills">
		<?php if ( is_sticky() && is_home() && ! is_paged() ) : ?>
			<span class="lumen-pill lumen-pill--strong"><?php esc_html_e( 'Pinned', 'lumen' ); ?></span>
		<?php endif; ?>
		<?php lumen_the_category_pills(); ?>
	</div>

	<h2 class="lumen-card-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>

	<?php lumen_the_post_meta(); ?>

	<?php if ( '' !== $lumen_excerpt ) : ?>
		<p class="lumen-card-excerpt"><?php echo esc_html( $lumen_excerpt ); ?></p>
	<?php endif; ?>

	<a class="lumen-button" href="<?php the_permalink(); ?>">
		<?php esc_html_e( 'Read more', 'lumen' ); ?><span class="screen-reader-text">: <?php the_title(); ?></span>
	</a>
</li>
