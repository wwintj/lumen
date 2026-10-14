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

			<nav class="lumen-site-nav" aria-label="<?php echo esc_attr__( 'Primary menu', 'lumen' ); ?>">
				<?php lumen_render_nav( 'primary' ); ?>
			</nav>

			<?php
			/*
			 * Header search — collapsed to a single icon by default.
			 *
			 * <details>/<summary> gives the open/close behaviour natively:
			 * the summary is focusable and toggles on Enter/Space with no
			 * JavaScript and no hand-maintained aria-expanded. While closed,
			 * the inner form is not rendered as visible content and its
			 * controls stay out of the normal Tab order.
			 *
			 * Deliberately a sibling of <nav>, never nested in its <ul>, so
			 * the navigation list stays a single semantic list. The 'header'
			 * context keeps the input id distinct from the one the search
			 * results template emits on the same page.
			 *
			 * Note: native <details> does NOT close on Escape. That behaviour
			 * is intentionally not faked, since doing so would require JS.
			 */
			?>
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
		</div>
	</header>

	<!-- tabindex="-1" makes #lumen-main a focus target for the skip link
	     (not a Tab stop, so it does not alter keyboard navigation). -->
	<main class="lumen-site-main" id="lumen-main" tabindex="-1">
