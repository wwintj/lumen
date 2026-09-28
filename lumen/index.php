<?php
/**
 * Lumen — archive / fallback template.
 *
 * Template hierarchy:
 *   - Home (latest posts): home.php
 *   - Posts page: the page selected in Settings → Reading (page.php)
 *   - category / tag / author / date / taxonomy archives: index.php (fallback)
 *   - search: search.php
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
			<?php
			$archive_title = '';

			if ( is_home() && ! is_front_page() ) :
				// Dedicated "posts page" (Settings → Reading → Posts page).
				$page_for_posts = (int) get_option( 'page_for_posts' );
				$archive_title  = $page_for_posts
					? get_the_title( $page_for_posts )
					: __( 'Latest posts', 'lumen' );
			elseif ( is_home() && is_front_page() ) :
				// Front page displaying the latest posts (no posts page).
				$archive_title  = __( 'Latest posts', 'lumen' );
			elseif ( is_archive() ) :
				// category / tag / author / date / taxonomy archives.
				// Clean context title via core term/author/date APIs.
				$archive_title  = lumen_archive_title();
			endif;

			if ( '' !== $archive_title ) {
				echo ( string ) $archive_title;
			}
			?>
		</h1>
		<?php
		$found_posts = 0;
		$context     = '';
		$description = '';

		if ( is_archive() ) {
			$found_posts   = (int) $GLOBALS['wp_query']->found_posts;
			$context       = lumen_archive_context_label();
			$description   = lumen_archive_term_description();
		}
		?>
		<?php if ( '' !== $context ) : ?>
			<p class="lumen-archive-context">
				<?php
				$label = esc_html( $context );
				if ( $found_posts > 0 ) {
					$label .= ' · ' . number_format_i18n( $found_posts ) . ' ' . esc_html__( 'posts', 'lumen' );
				}
				echo $label;
				?>
			</p>
		<?php endif; ?>
		<?php if ( '' !== $description ) : ?>
			<p class="lumen-archive-description">
				<?php echo esc_html( $description ); ?>
			</p>
		<?php endif; ?>
	</header>

	<?php get_template_part( 'template-parts/post-list' ); ?>
</section>

<?php get_footer(); ?>
