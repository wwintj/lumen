<?php
/**
 * Lumen — comments template.
 *
 * Renders the comments section using WordPress Core's native comment system.
 * No custom walker, no custom comment form, no theme JS. Core threading and
 * pagination are preserved exactly; this file only (a) fixes a structurally
 * invalid list wrapper and (b) targets the real Core classes for CSS.
 *
 * @package lumen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Password-protected posts must never expose the comment UI.
if ( post_password_required( get_the_ID() ) ) {
	return;
}

if ( have_comments() ) :
	?>
	<!--
		Comments (Core). Single #comments landmark, once, as required by the
		reading-focused contract. wp_list_comments() emits top-level <li> items
		with no list container (in xhtml format they are bare <li>), so we wrap
		them in a semantic <ol class="lumen-comment-list">; the nested
		<ul class="children"> remain valid Core child lists. Only valid Core
		args are passed: 'avatar_size' sizes the gravatar; the former 'class' /
		'time_on' args were not accepted by wp_list_comments() and were no-ops.
	-->
	<section id="comments" class="lumen-comments">
		<h2 class="lumen-comments-title"><?php echo esc_html( get_comments_number_text() ); ?></h2>

		<ol class="lumen-comment-list">
			<?php wp_list_comments( array( 'avatar_size' => 48 ) ); ?>
		</ol>

		<?php the_comments_pagination(); ?>

		<?php if ( comments_open() ) : ?>
			<div class="lumen-comment-form-wrap">
				<!--
					comment_form() has no bare 'class' arg; the container/form are
					already classed #respond.comment-respond / #commentform.comment-form
					by Core. We scope styling to .lumen-comments in main.css.
				-->
				<?php comment_form(); ?>
			</div>
		<?php else : ?>
			<p class="lumen-comments-closed"><?php echo esc_html__( 'Comments are closed.', 'lumen' ); ?></p>
		<?php endif; ?>
	</section>
	<?php else : ?>
	<section id="comments" class="lumen-comments">
		<h2 class="lumen-comments-title"><?php echo esc_html__( 'Comments', 'lumen' ); ?></h2>
		<?php if ( comments_open() ) : ?>
			<p class="lumen-comment-empty"><?php echo esc_html__( 'No comments yet. Be the first to start the conversation.', 'lumen' ); ?></p>
			<div class="lumen-comment-form-wrap">
				<?php comment_form(); ?>
			</div>
		<?php else : ?>
			<p class="lumen-comment-empty"><?php echo esc_html__( 'Comments are closed.', 'lumen' ); ?></p>
		<?php endif; ?>
	</section>
	<?php endif; ?>
