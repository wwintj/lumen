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

			<?php
			/*
			 * Search + navigation form ONE group. On desktop the group is pushed
			 * to the right edge with an auto margin, giving the same left/right
			 * rhythm the footer uses so the last menu item and the footer RSS link
			 * line up. On mobile the group is split across two grid rows by CSS:
			 * the magnifier on the brand's row, the navigation on its own row.
			 *
			 * There is deliberately ONE markup instance, repositioned purely with
			 * CSS per breakpoint — not a duplicate desktop/mobile search form with
			 * one of them hidden.
			 *
			 * The search toggle is a <button>, never an <a>: it performs an action
			 * rather than navigating, and a button is announced and activated
			 * correctly. `type="button"` keeps it from submitting any surrounding
			 * form. The toggle is also never nested inside the navigation <ul>, so
			 * the menu stays a single semantic list and cannot disturb its wrapping.
			 */
			?>
			<div class="lumen-header-nav-group">
				<div class="lumen-header-search-wrap">
					<button
						type="button"
						class="lumen-header-search-toggle"
						popovertarget="lumen-site-search-popover"
						popovertargetaction="toggle"
						aria-label="<?php echo esc_attr__( 'Search', 'lumen' ); ?>"
					>
						<?php
						echo lumen_search_icon_svg(); // phpcs:ignore WordPress.Security.EscapeOutput -- static inline SVG.
						?>
					</button>
				</div>

				<nav class="lumen-site-nav" aria-label="<?php echo esc_attr__( 'Primary menu', 'lumen' ); ?>">
					<?php lumen_render_nav( 'primary' ); ?>
				</nav>
			</div>
		</div>
	</header>

	<?php
	/*
	 * Global search popover.
	 *
	 * Native HTML Popover API: the button above toggles this element through
	 * popovertarget/popovertargetaction, so open, close, re-click, Escape and
	 * click-outside are all the browser's job. No JavaScript, no focus trap and
	 * no aria-modal — this is a NON-modal popover and must not claim to confine
	 * keyboard focus the way showModal() would.
	 *
	 * `popover="auto"` (not `manual`) is required here. Escape-to-close and
	 * light dismiss are defined only for the auto state; a manual popover never
	 * closes on Escape and never closes when the user clicks away, which would
	 * leave the search field stuck open with no pointer-only way out. Auto also
	 * supplies the ::backdrop used for the dimming layer in CSS.
	 *
	 * Colour refinement: with `auto`, ::backdrop is the browser's own layer, so
	 * the click target is the underlying page rather than the popover — clicking
	 * the toggle while open still reaches the button and closes the search.
	 *
	 * This sits outside <header> so it is not bound to the sticky header's
	 * stacking context or clipped by the container.
	 */
	?>
	<div id="lumen-site-search-popover" class="lumen-search-popover" popover="auto">
		<?php lumen_search_form( 'header' ); ?>
	</div>

	<!-- tabindex="-1" makes #lumen-main a focus target for the skip link
	     (not a Tab stop, so it does not alter keyboard navigation). -->
	<main class="lumen-site-main" id="lumen-main" tabindex="-1">
