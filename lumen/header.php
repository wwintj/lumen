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
		</div>
	</header>

	<!-- tabindex="-1" makes #lumen-main a focus target for the skip link
	     (not a Tab stop, so it does not alter keyboard navigation). -->
	<main class="lumen-site-main" id="lumen-main" tabindex="-1">
