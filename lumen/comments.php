<?php
/**
 * Lumen — comments template (Core).
 *
 * Self-contained: it renders its own <section id="comments"> wrapper.
 * Called from single.php via comments_template(), behind the Core gate:
 *     if ( comments_open() || get_comments_number() ) {
 *         comments_template();
 *     }
 *
 * Core APIs used (all WordPress Core, correct return types):
 *   post_password_required()         bool   skip output for password-protected posts
 *   have_comments()                  bool   whether the comment list exists
 *   get_comments_number_text()       string localized count, e.g. "1 comment"
 *   wp_list_comments()               void   comment list only (no pagination)
 *   the_comments_pagination()        void   Core comment pagination links
 *   comments_open()                  bool   whether the form may be shown
 *   comment_form()                   void   the form
 *
 * @package lumen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Password-protected post: Core does not show comments at all.
if ( post_password_required() ) {
	return;
}
?>
<section id="comments" class="lumen-comments">
	<?php if ( have_comments() ) : ?>
		<h2 class="lumen-comments-title">
			<?php
			// Localized Core count string ("1 comment" / "12 comments").
			echo esc_html( get_comments_number_text() );
			?>
		</h2>

		<?php
		// wp_list_comments() outputs the list only; comment pagination is a
		// separate Core output. Emit it explicitly so paged, threaded comments
		// are navigable without JavaScript.
		wp_list_comments( array(
			'class'       => 'lumen-comment-list',
			'avatar_size' => 48,
			'time_on'     => true,
		) );
		the_comments_pagination();
		?>

		<?php if ( comments_open() ) : ?>
			<div class="lumen-comment-form-wrap">
				<?php
				comment_form( array(
					'class' => 'lumen-comment-form',
				) );
				?>
			</div>
		<?php else : ?>
			<p class="lumen-comments-closed">
				<?php echo esc_html__( 'Comments are closed.', 'lumen' ); ?>
			</p>
		<?php endif; ?>
	<?php else : ?>
		<h2 class="lumen-comments-title">
			<?php echo esc_html__( 'Comments', 'lumen' ); ?>
		</h2>
		<p class="lumen-comment-empty">
			<?php echo esc_html__( 'No comments yet.', 'lumen' ); ?>
		</p>
		<?php if ( comments_open() ) : ?>
			<div class="lumen-comment-form-wrap">
				<?php
				comment_form( array(
					'class' => 'lumen-comment-form',
				) );
				?>
			</div>
		<?php else : ?>
			<p class="lumen-comments-closed">
				<?php echo esc_html__( 'Comments are closed.', 'lumen' ); ?>
			</p>
		<?php endif; ?>
	<?php endif; ?>
</section>
