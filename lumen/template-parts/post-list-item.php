<?php
/**
 * Lumen — single post list item.
 *
 * Intended to be included inside a `while ( have_posts() ) : the_post();` loop
 * (the main query). No-op outside a post context.
 *
 * Note: `have_posts()` must NOT be called here — it fires `loop_end` /
 * `rewind_posts()` on the last post and would restart the parent loop.
 *
 * @package lumen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<?php
if ( ! is_main_query() || empty( get_the_ID() ) ) {
	return;
}
$permalink = esc_url( get_the_permalink() );
?>
<li class="lumen-post-item">
	<article class="lumen-post-card">
		<?php if ( has_post_thumbnail() ) : ?>
			<a href="<?php echo $permalink; ?>" class="lumen-post-thumb">
				<?php the_post_thumbnail( 'lumen-card', array( 'loading' => 'lazy' ) ); ?>
			</a>
		<?php endif; ?>
		<h2 class="lumen-post-title">
			<a href="<?php echo $permalink; ?>">
				<?php echo esc_html( get_the_title() ); ?>
			</a>
		</h2>
		<p class="lumen-post-meta">
			<?php lumen_post_date(); ?>
			<?php lumen_post_categories(); ?>
		</p>
		<?php
		the_excerpt();
		?>
	</article>
</li>
