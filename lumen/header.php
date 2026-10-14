<?php
/**
 * Lumen — header (semantic site header + nav + skip link).
 *
 * @package lumen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php echo esc_attr( get_bloginfo( 'charset' ) ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
	<a class="lumen-skip-link" href="#lumen-main"><?php echo esc_html__( 'Skip to content', 'lumen' ); ?></a>

	<header class="lumen-site-header">
		<div class="lumen-container lumen-header-inner">
			<?php
			/*
			 * Desktop-only balancing spacer (hidden on mobile). On desktop the
			 * header is a 3-column grid whose outer columns are equal, so the
			 * middle column — the search + nav group — is centred while the brand
			 * stays hard left. Purely presentational.
			 */
			?>
			<div class="lumen-header-spacer-before" aria-hidden="true"></div>

			<div class="lumen-site-brand-wrap">
				<?php if ( has_custom_logo() ) : ?>
					<div class="lumen-site-logo">
						<?php the_custom_logo(); ?>
					</div>
				<?php else : ?>
					<a class="lumen-site-title" href="<?php echo esc_url( home_url( '/' ) ); ?>">
						<?php esc_html( bloginfo( 'name', false ) ); ?>
					</a>
				<?php endif; ?>
			</div>

			<?php
			/*
			 * Search + navigation form ONE group, so the magnifier sits directly
			 * before the first nav link and the pair can be centred as a unit on
			 * desktop or split across two rows on mobile (M2).
			 *
			 * <details>/<summary> gives the open/close behaviour natively: the
			 * summary is focusable and toggles on Enter/Space with no JavaScript
			 * and no hand-maintained aria-expanded. While closed, the inner input
			 * is not rendered and stays out of the normal Tab order.
			 *
			 * There is deliberately ONE markup instance, repositioned purely with
			 * CSS per breakpoint — not a duplicate desktop/mobile search form with
			 * one of them hidden.
			 *
			 * The search toggle is never nested inside the navigation <ul>, so the
			 * menu stays a single semantic list and cannot disturb its wrapping.
			 *
			 * Note: native <details> does NOT close on Escape. That behaviour is
			 * intentionally not faked, since doing so would require JavaScript.
			 */
			?>
			<div class="lumen-header-nav-group">
				<div class="lumen-header-search-wrap">
					<details class="lumen-header-search">
						<summary class="lumen-header-search-toggle">
							<?php
							echo lumen_search_icon_svg(); // phpcs:ignore WordPress.Security.EscapeOutput -- static inline SVG.
							?>
							<span class="visually-hidden"><?php echo esc_html__( 'Search', 'lumen' ); ?></span>
						</summary>
						<div class="lumen-header-search-panel">
							<?php lumen_search_form( 'header' ); ?>
						</div>
					</details>
				</div>

				<nav class="lumen-site-nav" aria-label="<?php echo esc_attr__( 'Primary menu', 'lumen' ); ?>">
					<?php lumen_render_nav( 'primary' ); ?>
				</nav>
			</div>

			<div class="lumen-header-spacer" aria-hidden="true"></div>
		</div>
	</header>

	<!-- tabindex="-1" makes #lumen-main a focus target for the skip link
	     (not a Tab stop, so it does not alter keyboard navigation). -->
	<main class="lumen-site-main" id="lumen-main" tabindex="-1">
