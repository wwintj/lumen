<?php
/**
 * Lumen — comments template.
 *
 * Renders the comments section using WordPress Core's native comment system.
 * No custom walker, no custom comment form, no theme JS. Core threading,
 * ordering, pagination, moderation and the guest/registered permission model
 * are preserved exactly.
 *
 * This template only decides *what markup is emitted*; all presentation lives
 * in main.css. Deliberate changes from the former version:
 *
 *   - No visible section heading. "Comments" / "Comments (N)" are not printed
 *     at all (the reading contract asks for a heading-free, minimal block);
 *     the section keeps its #comments landmark and an accessible name so the
 *     region is still announced and still targetable by Core's reply links.
 *   - No "Leave a comment" / "Leave a Reply" heading. Core's comment_form()
 *     title_reply is set to an empty string, so the visible heading and the
 *     duplicate <h3 id="reply-title"> text are gone while every Core field,
 *     id, name and hidden input is untouched.
 *   - No "No comments yet" filler line (requirement C.2/C.4): with zero
 *     comments the block is simply the form, and with comments closed and
 *     zero comments nothing is emitted at all.
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

$lumen_has_comments = have_comments();
$lumen_comments_open = comments_open();

// Requirement C.4: comments closed and nothing to show → emit nothing rather
// than a meaningless empty block.
if ( ! $lumen_has_comments && ! $lumen_comments_open ) {
	return;
}

/*
 * comment_form() args. Only Core-supported args are used.
 *
 * 'title_reply' => '' removes the visible heading (E.1). Core still prints
 * <h3 id="reply-title" class="comment-reply-title"> — now empty — which keeps
 * the cancel-reply anchor and #respond contract intact for nested replies.
 * 'label_submit' keeps Core's own translated string, and 'comment_notes_before'
 * is left at Core's default so guests still see the email-privacy notice.
 */
$lumen_form_args = array(
	'title_reply'          => '',
	'title_reply_before'   => '<h3 id="reply-title" class="comment-reply-title">',
	'title_reply_after'    => '</h3>',
	'comment_notes_before' => '',
	'comment_notes_after'  => '',
);
?>
<section id="comments" class="lumen-comments" aria-label="<?php echo esc_attr__( 'Comments', 'lumen' ); ?>">
	<?php if ( $lumen_has_comments ) : ?>
		<!--
			Comments (Core). Single #comments landmark, once, as required by the
			reading-focused contract. wp_list_comments() emits top-level <li> items
			with no list container (in xhtml format they are bare <li>), so we wrap
			them in a semantic <ol class="lumen-comment-list">; the nested
			<ul class="children"> remain valid Core child lists. Only valid Core
			args are passed: 'avatar_size' sizes the gravatar.
		-->
		<ol class="lumen-comment-list">
			<?php wp_list_comments( array( 'avatar_size' => 48 ) ); ?>
		</ol>

		<?php the_comments_pagination(); ?>
	<?php endif; ?>

	<?php if ( $lumen_comments_open ) : ?>
		<div class="lumen-comment-form-wrap">
			<!--
				comment_form() has no bare 'class' arg; the container/form are
				already classed #respond.comment-respond / #commentform.comment-form
				by Core. We scope styling to .lumen-comments in main.css.

				Guest commenting is Core's decision: with "Users must be
				registered and logged in to comment" off, Core renders the
				Name / Email / Website fields to logged-out visitors and
				accepts the submission through wp-comments-post.php. This
				template does not bypass that permission model in any way.
			-->
			<?php comment_form( $lumen_form_args ); ?>
		</div>
	<?php else : ?>
		<p class="lumen-comments-closed"><?php echo esc_html__( 'Comments are closed.', 'lumen' ); ?></p>
	<?php endif; ?>
</section>
