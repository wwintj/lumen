<?php
/**
 * Lumen — shared post list (archive / search).
 *
 * Template hierarchy:
 *   - category.php
 *   - tag.php
 *   - author.php
 *   - archive.php
 *   - index.php
 *   - search.php
 *
 * The context ('archive' | 'search') is received via $args, which is set by
 * load_template() in WP core when the third $args array is passed to
 * get_template_part(). Unknown or missing context normalizes to 'archive'.
 *
 * @package lumen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Read the explicit context from $args (third arg of the parent call).
$context = 'archive';
if ( isset( $args ) && is_array( $args ) && isset( $args['context'] ) ) {
	$context = (string) $args['context'];
}
if ( '' !== $context && ! in_array( $context, array( 'archive', 'search' ), true ) ) {
	$context = 'archive';
}

if ( have_posts() ) :
	?>
	<ul class="lumen-post-list">
		<?php
		while ( have_posts() ) :
			the_post();

			?>
			<li>
				<?php get_template_part( 'template-parts/post-list-item', null, array( 'context' => $context ) ); ?>
			</li>
			<?php
		endwhile;
		?>
	</ul>

	<?php lumen_pagination(); ?>

	<?php
elseif ( ! have_posts() ) :
	?>
	<p class="lumen-archive-empty">
		<?php
		if ( 'search' === $context ) {
			$query = (string) get_search_query();
			if ( '' !== $query ) {
				// Search empty: "No results for 'query'".
				printf( __( 'No results for %s', 'lumen' ), esc_html( $query ) );
			} else {
				echo esc_html__( 'No results found.', 'lumen' );
			}
		} else {
			// Archive empty: "No posts found."
			echo esc_html__( 'No posts found.', 'lumen' );
		}
		?>
	</p>
	<?php
endif;
?>
