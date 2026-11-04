<?php
/**
 * Lumen — the main query as a post list, with pagination or an empty state.
 *
 * @package lumen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( have_posts() ) :
	/*
	 * Masonry without JavaScript: posts are dealt alternately into two
	 * columns (1, 3, 5… left; 2, 4, 6… right), and each column stacks its
	 * cards at their natural height. On narrow screens the columns dissolve
	 * (display: contents) and each card's --i restores the original order.
	 */
	$lumen_columns = array( '', '' );
	$lumen_index   = 0;
	while ( have_posts() ) :
		the_post();
		ob_start();
		get_template_part( 'template-parts/post-item', null, array( 'index' => $lumen_index ) );
		$lumen_columns[ $lumen_index % 2 ] .= ob_get_clean();
		++$lumen_index;
	endwhile;
	?>
	<div class="lumen-cards">
		<?php foreach ( $lumen_columns as $lumen_column ) : ?>
			<?php // Both columns always render, so a lone card stays half width. ?>
			<ul class="lumen-cards-col"><?php echo $lumen_column; // phpcs:ignore WordPress.Security.EscapeOutput -- escaped in post-item.php. ?></ul>
		<?php endforeach; ?>
	</div>
	<?php
	lumen_the_posts_pagination();
else :
	?>
	<p class="lumen-empty">
		<?php
		if ( is_search() ) {
			esc_html_e( 'Nothing matched your search. Try different words.', 'lumen' );
		} else {
			esc_html_e( 'No posts yet.', 'lumen' );
		}
		?>
	</p>
	<?php
endif;
