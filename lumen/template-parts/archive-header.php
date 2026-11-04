<?php
/**
 * Lumen — archive heading panel: title, post count, optional description.
 *
 * @package lumen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$lumen_object      = get_queried_object();
$lumen_description = ( $lumen_object instanceof WP_Term ) ? $lumen_object->description : '';
?>
<header class="lumen-archive-header">
	<div class="lumen-archive-heading">
		<h1 class="lumen-archive-title"><?php echo esc_html( lumen_get_archive_title() ); ?></h1>
		<span class="lumen-pill lumen-pill--purple"><?php echo esc_html( lumen_posts_count_label( $GLOBALS['wp_query']->found_posts ) ); ?></span>
	</div>
	<?php if ( '' !== trim( (string) $lumen_description ) ) : ?>
		<div class="lumen-archive-description"><?php echo wp_kses_post( wpautop( $lumen_description ) ); ?></div>
	<?php endif; ?>
</header>
