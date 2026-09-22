<?php
/**
 * Lumen — search results template.
 *
 * @package lumen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<?php get_header(); ?>

<section class="lumen-archive-wrap">
	<header class="lumen-archive-header">
		<h1 class="lumen-archive-title">
			<?php printf(
				esc_html__( 'Search results for “%1$s”', 'lumen' ),
				esc_html( get_search_query() )
			); ?>
		</h1>
		<?php lumen_search_form(); ?>
	</header>

	<?php get_template_part( 'template-parts/post-list' ); ?>
</section>

<?php get_footer(); ?>
