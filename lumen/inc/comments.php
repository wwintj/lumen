<?php
/**
 * Lumen — comment form and list tweaks.
 *
 * Presentation only: who may comment, moderation and threading stay with
 * WordPress Core and the site's Discussion settings.
 *
 * @package lumen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Comment form strings and markup.
 *
 * @param array $defaults Core defaults.
 * @return array
 */
function lumen_comment_form_defaults( $defaults ) {
	$defaults['title_reply']          = __( 'Leave a comment', 'lumen' );
	/* translators: %s: comment author name. */
	$defaults['title_reply_to']       = __( 'Reply to %s', 'lumen' );
	$defaults['title_reply_before']   = '<h2 id="reply-title" class="comment-reply-title">';
	$defaults['title_reply_after']    = '</h2>';
	$defaults['cancel_reply_link']    = __( 'Cancel', 'lumen' );
	$defaults['logged_in_as']         = '';
	$defaults['comment_notes_before'] = '';
	$defaults['class_submit']         = 'submit lumen-button';
	return $defaults;
}
add_filter( 'comment_form_defaults', 'lumen_comment_form_defaults' );

/**
 * Placeholder on the comment textarea (the real <label> stays).
 *
 * @param string $field Textarea markup.
 * @return string
 */
function lumen_comment_textarea_placeholder( $field ) {
	if ( str_contains( $field, 'placeholder=' ) ) {
		return $field;
	}
	return str_replace(
		'<textarea ',
		'<textarea placeholder="' . esc_attr__( 'Write your comment…', 'lumen' ) . '" ',
		$field
	);
}
add_filter( 'comment_form_field_comment', 'lumen_comment_textarea_placeholder' );

/**
 * Commenter names render as plain text, never as a link to their website.
 *
 * Attached only around wp_list_comments() in comments.php.
 *
 * @param string $link       Linked author HTML.
 * @param string $author     Author name.
 * @param int    $comment_id Comment ID.
 * @return string
 */
function lumen_plain_comment_author( $link, $author = '', $comment_id = 0 ) {
	return esc_html( get_comment_author( $comment_id ) );
}

/**
 * Comment timestamps as "date time".
 *
 * Core prints '%1$s at %2$s'; some locales (e.g. zh_TW) translate it with no
 * separator, which runs the date and time together. Attached only around
 * wp_list_comments() in comments.php.
 *
 * @param string $translation Translated text.
 * @param string $text        Original text.
 * @param string $domain      Text domain.
 * @return string
 */
function lumen_comment_date_format( $translation, $text, $domain ) {
	if ( 'default' === $domain && '%1$s at %2$s' === $text ) {
		return '%1$s %2$s';
	}
	return $translation;
}
