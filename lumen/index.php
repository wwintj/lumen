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

<?php
/*
 * Category-only intro enhancement (see Phase 8F-R1). This must be resolved
 * before the <header> element is rendered, because the decorative class is
 * part of its class attribute. Applied on is_category() alone so that tag,
 * date, author, taxonomy and post-type archives sharing this template keep
 * their original presentation.
 */
$is_category_intro = is_category();
?>

<section class="lumen-archive-wrap">
	<header class="<?php echo esc_attr( 'lumen-archive-header' . ( $is_category_intro ? ' lumen-category-intro' : '' ) ); ?>">
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
			$context       = lumen_archive_context_label( $found_posts );
			$description   = lumen_archive_term_description();
		}
		?>
		<?php if ( '' !== $context ) : ?>
			<p class="lumen-archive-context">
				<?php echo esc_html( $context ); ?>
			</p>
		<?php endif; ?>
		<?php if ( '' !== $description ) : ?>
			<p class="lumen-archive-description">
				<?php
				// lumen_archive_term_description() already returns wp_kses_post()
				// output; echo it directly (no extra escaping).
				echo $description;
				?>
			</p>
		<?php endif; ?>
	</header>

	<?php if ( $is_category_intro ) : ?>
		<?php
		/*
		 * Divider between the category introduction and the post listing.
		 * Purely decorative: aria-hidden + empty, so it is skipped by
		 * assistive technology and never appears in the heading outline.
		 */
		?>
		<div class="lumen-category-intro-divider" aria-hidden="true"></div>
	<?php endif; ?>

	<?php get_template_part( 'template-parts/post-list', null, array( 'context' => 'archive' ) ); ?>
</section>

<?php get_footer(); ?>
