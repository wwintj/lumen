<?php
/**
 * Lumen — static page.
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
			<h1 class="lumen-entry-title"><?php the_title(); ?></h1>
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
	</article>

	<?php if ( comments_open() || get_comments_number() ) : ?>
		<div class="lumen-column"><?php comments_template(); ?></div>
	<?php endif; ?>
	<?php
endwhile;

get_footer();
