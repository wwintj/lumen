<?php
/**
 * Lumen — document head and site header.
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
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="lumen-skip-link" href="#lumen-main"><?php esc_html_e( 'Skip to content', 'lumen' ); ?></a>

<header class="lumen-header">
	<div class="lumen-header-inner">
		<div class="lumen-brand">
			<?php if ( has_custom_logo() ) : ?>
				<?php the_custom_logo(); ?>
			<?php else : ?>
				<a class="lumen-site-title" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php echo esc_html( get_bloginfo( 'name' ) ); ?></a>
			<?php endif; ?>
			<?php if ( '' !== get_bloginfo( 'description' ) ) : ?>
				<p class="lumen-tagline"><?php echo esc_html( get_bloginfo( 'description' ) ); ?></p>
			<?php endif; ?>
		</div>

		<button type="button" class="lumen-search-toggle" popovertarget="lumen-search" aria-label="<?php esc_attr_e( 'Search', 'lumen' ); ?>" title="<?php esc_attr_e( 'Search', 'lumen' ); ?>">
			<?php echo lumen_icon( 'search' ); // phpcs:ignore WordPress.Security.EscapeOutput -- static SVG. ?>
		</button>

		<?php if ( has_nav_menu( 'primary' ) ) : ?>
			<nav class="lumen-nav" aria-label="<?php esc_attr_e( 'Primary menu', 'lumen' ); ?>">
				<?php lumen_render_nav( 'primary' ); ?>
			</nav>
		<?php endif; ?>
	</div>
</header>

<?php /* Native popover: open/close, Esc and click-outside need no JavaScript. */ ?>
<div id="lumen-search" class="lumen-search-popover" popover>
	<?php lumen_search_form( 'popover' ); ?>
</div>

<main id="lumen-main" class="lumen-main" tabindex="-1">
