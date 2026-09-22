<?php
/**
 * Lumen — archive / blog home / fallback template.
 *
 * Template hierarchy:
 *   - Home (latest posts): home.php, or index.php (front page, no posts page)
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
				$archive_title  = get_the_archive_title();
			else :
				$archive_title  = __( 'Latest posts', 'lumen' );
			endif;

			echo esc_html( $archive_title );
			?>
		</h1>
		<?php if ( is_archive( 'posts' ) ) : ?>
			<?php lumen_search_form(); ?>
		<?php endif; ?>
	</header>

	<?php get_template_part( 'template-parts/post-list' ); ?>
</section>

<?php get_footer(); ?>