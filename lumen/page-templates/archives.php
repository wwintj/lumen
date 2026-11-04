<?php
/**
 * Template Name: Archives (all posts by year)
 *
 * Lists every published post grouped by year. Any text written in the page
 * itself is shown above the list as an introduction.
 *
 * @package lumen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();

$lumen_posts = get_posts(
	array(
		'post_type'              => 'post',
		'post_status'            => 'publish',
		'numberposts'            => -1,
		'orderby'                => 'date',
		'order'                  => 'DESC',
		'ignore_sticky_posts'    => true,
		'no_found_rows'          => true,
		'update_post_meta_cache' => false,
		'update_post_term_cache' => false,
	)
);

$lumen_years = array();
foreach ( $lumen_posts as $lumen_post ) {
	$lumen_years[ get_the_date( 'Y', $lumen_post ) ][] = $lumen_post;
}

while ( have_posts() ) :
	the_post();
	?>
	<article id="post-<?php the_ID(); ?>" <?php post_class( 'lumen-column lumen-entry' ); ?>>
		<header class="lumen-entry-header">
			<h1 class="lumen-entry-title"><?php the_title(); ?></h1>
			<div class="lumen-pills">
				<span class="lumen-pill"><?php echo esc_html( lumen_posts_count_label( count( $lumen_posts ) ) ); ?></span>
			</div>
		</header>

		<?php if ( '' !== trim( get_the_content() ) ) : ?>
			<div class="lumen-prose"><?php the_content(); ?></div>
		<?php endif; ?>

		<?php foreach ( $lumen_years as $lumen_year => $lumen_year_posts ) : ?>
			<section class="lumen-year" aria-labelledby="lumen-year-<?php echo esc_attr( $lumen_year ); ?>">
				<h2 class="lumen-year-title" id="lumen-year-<?php echo esc_attr( $lumen_year ); ?>">
					<?php echo esc_html( $lumen_year ); ?>
					<span class="lumen-year-count"><?php echo esc_html( lumen_posts_count_label( count( $lumen_year_posts ) ) ); ?></span>
				</h2>
				<ul class="lumen-year-list">
					<?php foreach ( $lumen_year_posts as $lumen_post ) : ?>
						<li>
							<time datetime="<?php echo esc_attr( get_the_date( DATE_W3C, $lumen_post ) ); ?>"><?php echo esc_html( get_the_date( _x( 'm-d', 'archive list date format', 'lumen' ), $lumen_post ) ); ?></time>
							<a href="<?php echo esc_url( get_permalink( $lumen_post ) ); ?>"><?php echo esc_html( get_the_title( $lumen_post ) ); ?></a>
						</li>
					<?php endforeach; ?>
				</ul>
			</section>
		<?php endforeach; ?>
	</article>
	<?php
endwhile;

get_footer();
