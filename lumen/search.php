<?php
/**
 * Lumen — search results.
 *
 * @package lumen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();

$lumen_query = get_search_query( false );
$lumen_found = (int) $GLOBALS['wp_query']->found_posts;
?>
<div class="lumen-wide">
	<header class="lumen-page-header">
		<h1 class="screen-reader-text"><?php esc_html_e( 'Search', 'lumen' ); ?></h1>
		<div class="lumen-page-heading">
			<?php lumen_the_breadcrumbs(); ?>
			<?php if ( '' !== $lumen_query ) : ?>
				<span class="lumen-pill">
					<?php
					echo esc_html(
						sprintf(
							/* translators: 1: number of results, 2: search query. */
							_n( '%1$s result for “%2$s”', '%1$s results for “%2$s”', $lumen_found, 'lumen' ),
							number_format_i18n( $lumen_found ),
							$lumen_query
						)
					);
					?>
				</span>
			<?php endif; ?>
		</div>
		<?php lumen_search_form( 'page' ); ?>
	</header>

	<?php get_template_part( 'template-parts/post-list' ); ?>
</div>
<?php
get_footer();
