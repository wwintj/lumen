<?php
/**
 * Lumen — static page template.
 *
 * @package lumen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<?php get_header(); ?>

<article class="lumen-page">
	<div class="lumen-page-wrap">
		<h1 class="lumen-page-title"><?php the_title(); ?></h1>

		<div class="lumen-page-body">
			<?php
			the_content();
			?>
		</div>
	</div>
</article>

<?php get_footer(); ?>
