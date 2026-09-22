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
			<nav class="lumen-site-footer-nav" aria-label="<?php echo esc_attr__( 'Footer menu', 'lumen' ); ?>">
				<?php lumen_render_nav( 'footer' ); ?>
			</nav>

			<div class="lumen-footer-meta">
				<p class="lumen-footer-copyright">
					<?php printf(
						esc_html__( '© %1$s %2s.', 'lumen' ),
						esc_html( current_time( 'Y' ) ),
						esc_html( bloginfo( 'name', false ) )
					); ?>
				</p>

				<span class="lumen-footer-feed" aria-label="<?php echo esc_attr__( 'RSS feed', 'lumen' ); ?>">
					<a href="<?php echo esc_url( home_url( '/?feed=rss2' ) ); ?>" rel="alternate"><span aria-hidden="true">&#9654;</span></a>
				</span>
			</div>
		</div>
	</footer>

	<?php wp_footer(); ?>
</body>
</html>
