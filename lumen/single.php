<?php
/**
 * Lumen — single post.
 *
 * @package lumen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();

while ( have_posts() ) :
	the_post();
	?>
	<article id="post-<?php the_ID(); ?>" <?php post_class( 'lumen-column lumen-entry' ); ?>>
		<header class="lumen-entry-header">
			<?php if ( has_category() ) : ?>
				<div class="lumen-pills"><?php lumen_the_category_pills(); ?></div>
			<?php endif; ?>
			<h1 class="lumen-entry-title"><?php the_title(); ?></h1>
			<?php lumen_the_post_meta(); ?>
		</header>

		<?php if ( has_post_thumbnail() ) : ?>
			<figure class="lumen-featured">
				<?php the_post_thumbnail( 'large', array( 'loading' => 'eager', 'fetchpriority' => 'high' ) ); ?>
			</figure>
		<?php endif; ?>

		<div class="lumen-prose">
			<?php
			the_content();
			lumen_the_page_links();
			?>
		</div>

		<?php if ( has_tag() ) : ?>
			<footer class="lumen-entry-footer">
				<?php lumen_the_tag_list(); ?>
			</footer>
		<?php endif; ?>
	</article>

	<div class="lumen-column">
		<?php
		the_post_navigation(
			array(
				// A pill button with the post title shown underneath it.
				'prev_text'          => '<span class="lumen-post-nav-button">' . esc_html__( '← Previous', 'lumen' ) . '</span><span class="lumen-post-nav-title">%title</span>',
				'next_text'          => '<span class="lumen-post-nav-button">' . esc_html__( 'Next →', 'lumen' ) . '</span><span class="lumen-post-nav-title">%title</span>',
				'screen_reader_text' => __( 'More posts', 'lumen' ),
				'aria_label'         => __( 'More posts', 'lumen' ),
				'class'              => 'lumen-post-nav',
			)
		);

		if ( comments_open() || get_comments_number() ) {
			comments_template();
		}
		?>
	</div>
	<?php
endwhile;

get_footer();
