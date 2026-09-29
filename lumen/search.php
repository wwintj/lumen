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
		$query       = (string) get_search_query();
		?>
		<?php if ( '' !== $query ) : ?>
			<p class="lumen-archive-context">
				<?php
				// Always shown (even 0 hits). lumen_search_results_label()
				// returns "N result(s) for 'query'", escaped exactly once.
				echo lumen_search_results_label( $found_posts, $query );
				?>
			</p>
		<?php endif; ?>
		<?php lumen_search_form(); ?>
	</header>

	<?php get_template_part( 'template-parts/post-list', null, array( 'context' => 'search' ) ); ?>
</section>

<?php get_footer(); ?>
