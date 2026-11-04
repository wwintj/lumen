<?php
/**
 * Lumen — not found.
 *
 * @package lumen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();
?>
<div class="lumen-column lumen-not-found">
	<h1 class="lumen-entry-title"><?php esc_html_e( 'Page not found', 'lumen' ); ?></h1>
	<p><?php esc_html_e( 'The link may be broken, or the page may have moved. Try a search:', 'lumen' ); ?></p>
	<?php lumen_search_form( 'page' ); ?>
	<p><a class="lumen-pill" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( '← Back to home', 'lumen' ); ?></a></p>
</div>
<?php
get_footer();
