<?php
/**
 * Lumen — archive heading: large title + post count, breadcrumbs, description.
 *
 * @package lumen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$lumen_object      = get_queried_object();
$lumen_description = ( $lumen_object instanceof WP_Term ) ? $lumen_object->description : '';
?>
<header class="lumen-page-header">
	<?php lumen_the_breadcrumbs(); ?>
	<div class="lumen-page-heading">
		<h1 class="lumen-page-title"><?php echo esc_html( lumen_get_archive_title() ); ?></h1>
		<span class="lumen-pill"><?php echo esc_html( lumen_posts_count_label( $GLOBALS['wp_query']->found_posts ) ); ?></span>
	</div>
	<?php if ( '' !== trim( (string) $lumen_description ) ) : ?>
		<div class="lumen-page-description"><?php echo wp_kses_post( wpautop( $lumen_description ) ); ?></div>
	<?php endif; ?>
</header>
