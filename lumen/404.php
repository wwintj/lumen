<?php
/**
 * Lumen — 404 template.
 *
 * @package lumen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<?php get_header(); ?>

<section class="lumen-not-found-wrap">
	<div class="lumen-not-found">
		<h1 class="lumen-not-found-code">404</h1>
		<p class="lumen-not-found-message">
			<?php echo esc_html__( 'Sorry, we could not find that page.', 'lumen' ); ?>
		</p>
		<p class="lumen-not-found-sub">
			<?php echo esc_html__( 'You may have mistyped the URL or the page may have been moved.', 'lumen' ); ?>
		</p>
		<?php lumen_search_form(); ?>
		<a class="lumen-btn lumen-not-found-home" href="<?php echo esc_url( home_url( '/' ) ); ?>">
			<?php echo esc_html__( 'Back to home', 'lumen' ); ?>
		</a>
	</div>
</section>

<?php get_footer(); ?>
