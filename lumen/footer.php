<?php
/**
 * Lumen — site footer.
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
		<div class="lumen-footer-main">
			<?php if ( has_nav_menu( 'footer' ) ) : ?>
				<nav class="lumen-footer-nav" aria-label="<?php esc_attr_e( 'Footer menu', 'lumen' ); ?>">
					<?php lumen_render_nav( 'footer' ); ?>
				</nav>
			<?php endif; ?>
			<p class="lumen-copyright">&copy; <?php echo esc_html( wp_date( 'Y' ) ); ?> <?php echo esc_html( get_bloginfo( 'name' ) ); ?></p>
		</div>
		<a class="lumen-footer-link" href="<?php echo esc_url( get_feed_link() ); ?>">RSS</a>
	</div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
