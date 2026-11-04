<?php
/**
 * Lumen — site footer: one centred line on a dark full-width band.
 *
 * © year site name · footer menu links · RSS
 *
 * @package lumen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
</main>

<footer class="lumen-footer">
	<div class="lumen-footer-inner">
		<p class="lumen-copyright">
			&copy; <?php echo esc_html( wp_date( 'Y' ) ); ?>
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php echo esc_html( get_bloginfo( 'name' ) ); ?></a>
		</p>
		<?php if ( has_nav_menu( 'footer' ) ) : ?>
			<nav class="lumen-footer-nav" aria-label="<?php esc_attr_e( 'Footer menu', 'lumen' ); ?>">
				<?php lumen_render_nav( 'footer' ); ?>
			</nav>
		<?php endif; ?>
		<a class="lumen-footer-rss" href="<?php echo esc_url( get_feed_link() ); ?>">RSS</a>
	</div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
