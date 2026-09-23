<?php
/**
 * Lumen — footer (closes main, renders footer nav + meta).
 *
 * @package lumen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
	</main>

	<footer class="lumen-site-footer">
		<div class="lumen-container lumen-footer-inner">
			<div class="lumen-footer-left">
				<nav class="lumen-site-footer-nav" aria-label="<?php echo esc_attr__( 'Footer menu', 'lumen' ); ?>">
					<?php lumen_render_nav( 'footer' ); ?>
				</nav>
				<p class="lumen-footer-copyright">
					<?php printf(
						esc_html__( '© %1$s %2$s', 'lumen' ),
						esc_html( current_time( 'Y' ) ),
						esc_html( bloginfo( 'name', false ) )
					); ?>
				</p>
			</div>
			<a class="lumen-footer-feed"
				href="<?php echo esc_url( home_url( '/?feed=rss2' ) ); ?>"
				rel="alternate"
				aria-label="<?php echo esc_attr__( 'RSS feed', 'lumen' ); ?>">RSS</a>
		</div>
	</footer>

	<?php wp_footer(); ?>
</body>
</html>