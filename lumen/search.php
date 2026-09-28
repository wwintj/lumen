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

<section class="lumen-archive-wrap lumen-search-page">
	<header class="lumen-archive-header">
		<h1 class="lumen-archive-title">
			<?php echo esc_html__( 'Search', 'lumen' ); ?>
		</h1>
		<?php
		$found_posts = (int) $GLOBALS['wp_query']->found_posts;
		if ( $found_posts > 0 ) :
			?>
			<p class="lumen-archive-context">
				<?php
				printf(
					'%s %s',
					number_format_i18n( $found_posts ),
					esc_html__( 'results', 'lumen' )
				);
				?>
			</p>
			<?php
		endif;
		?>
		<?php lumen_search_form(); ?>
	</header>

	<?php get_template_part( 'template-parts/post-list' ); ?>
</section>

<?php get_footer(); ?>
