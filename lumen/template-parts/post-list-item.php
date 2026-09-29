<?php
/**
 * Lumen — single list item (archive / search).
 *
 * Receives the explicit context via $args (third arg of the parent
 * get_template_part() call), e.g. array( 'context' => 'archive' | 'search' ).
 * Unknown or missing context normalizes to 'archive'.
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

$search = ( 'search' === $context );
$card_class = $search ? 'lumen-post-card lumen-list-search' : 'lumen-post-card';
?>
<div class="<?php echo esc_attr( $card_class ); ?>">
	<?php if ( $search ) : ?>
		<!-- search order: title -> meta -> excerpt -->
		<h2 class="lumen-post-title">
			<a href="<?php echo esc_url( get_permalink() ); ?>">
				<?php echo get_the_title(); ?>
			</a>
		</h2>
		<?php lumen_list_meta(); ?>
		<?php
		if ( $excerpt = lumen_list_excerpt( $context ) ) {
			echo '<p class="lumen-post-excerpt">' . $excerpt . '</p>';
		}
		?>
	<?php else : ?>
		<!-- archive order: meta -> title -> excerpt -->
		<?php lumen_list_meta(); ?>
		<h2 class="lumen-post-title">
			<a href="<?php echo esc_url( get_permalink() ); ?>">
				<?php echo get_the_title(); ?>
			</a>
		</h2>
		<?php
		if ( $excerpt = lumen_list_excerpt( $context ) ) {
			echo '<p class="lumen-post-excerpt">' . $excerpt . '</p>';
		}
		?>
	<?php endif; ?>
</div>
<?php
