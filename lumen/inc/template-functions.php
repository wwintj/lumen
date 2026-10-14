<?php
/**
 * Lumen — template helper functions.
 *
 * All public helpers are `lumen_`-prefixed to avoid global collisions.
 * These are presentation helpers only; no business logic.
 *
 * @package lumen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'lumen_render_nav' ) ) {
	function lumen_render_nav( $location = 'primary' ) {
		if ( has_nav_menu( $location ) ) {
			wp_nav_menu( array(
				'location'  => $location,
				'menu_wrap' => '<ul class="lumen-nav-links">',
				'container' => false,
				'menu_class' => false,
			) );
		}
	}
}

if ( ! function_exists( 'lumen_footer_nav' ) ) {
	function lumen_footer_nav() {
		// Primary footer menu; no-op when unset.
		lumen_render_nav( 'footer' );
	}
}

if ( ! function_exists( 'lumen_pagination' ) ) {
	function lumen_pagination() {
		the_posts_pagination( array(
			'mid_size'  => 2,
			'prev_text' => esc_html__( 'Previous', 'lumen' ),
			'next_text' => esc_html__( 'Next', 'lumen' ),
			'class'     => 'lumen-pagination',
		) );
	}
}

if ( ! function_exists( 'lumen_search_form' ) ) {
	/**
	 * Render the native WordPress search form.
	 *
	 * WordPress search is a plain GET to the site root with the `s` query var,
	 * so this works with no JavaScript at all.
	 *
	 * The `$context` argument exists so that a page can legitimately contain
	 * more than one search form (e.g. the header form plus the form on the
	 * search results template) without emitting duplicate HTML `id` values,
	 * which would break both label association and ARIA references.
	 *
	 * Called with no argument it keeps emitting `lumen-search`, so existing
	 * call sites (search.php, 404.php) are unaffected.
	 *
	 * @param string $context Optional. 'default' or 'header'.
	 * @return void
	 */
	function lumen_search_form( $context = 'default' ) {
		$is_header = ( 'header' === $context );

		// Unique, predictable IDs per context. The form element itself gets
		// no id: the baseline markup never had one, and reusing the input's
		// id on the form would create a duplicate id in the same document.
		$input_id = $is_header ? 'lumen-header-search-input' : 'lumen-search';
		$label_id = $is_header ? 'lumen-header-search-label' : 'lumen-search-label';

		// Distinct modifier class so header styling stays scoped.
		$form_class = $is_header
			? 'lumen-search-form lumen-header-search'
			: 'lumen-search-form';

		// The header form is a compact landmark; the in-page form is not.
		$aria_label = $is_header
			? ' aria-label="' . esc_attr__( 'Site search', 'lumen' ) . '"'
			: '';

		// Header context: the input lives inside the global search popover, so
		// it asks for focus as the popover opens. `autofocus` is honoured where
		// the popover moves focus on open; where it is not, the user simply
		// clicks or Tabs into the field. Nothing here depends on that.
		$autofocus = $is_header ? ' autofocus' : '';

		// Header context: a short hint inside the field. The placeholder is a
		// convenience ONLY — it never replaces the real <label> below, which
		// stays in the accessibility tree as the field's name.
		$placeholder = $is_header
			? ' placeholder="' . esc_attr__( 'Search articles…', 'lumen' ) . '"'
			: '';

		echo '<form role="search" method="get" action="' . esc_url( home_url( '/' ) ) . '" class="' . esc_attr( $form_class ) . '"' . $aria_label . '>';
		echo '<label id="' . esc_attr( $label_id ) . '" for="' . esc_attr( $input_id ) . '" class="visually-hidden">' . esc_html__( 'Search', 'lumen' ) . '</label>';
		echo '<input id="' . esc_attr( $input_id ) . '" name="s" type="search" class="lumen-search-input" value="' . esc_attr( get_query_var( 's' ) ) . '" autocomplete="off"' . $placeholder . $autofocus . '>';

		if ( $is_header ) {
			// Header context: the form holds ONLY the input. The magnifier button
			// opens the popover and is not a submit control (an <input type=submit>
			// here would be a second, visually redundant button), so no submit
			// button is emitted. Pressing Enter in the input still submits the
			// form natively — no JavaScript involved.
		} else {
			echo '<button type="submit" class="lumen-search-button">' . esc_html__( 'Search', 'lumen' ) . '</button>';
		}

		echo '</form>';
	}
}

if ( ! function_exists( 'lumen_search_icon_svg' ) ) {
	/**
	 * Return the decorative inline magnifier SVG.
	 *
	 * Inline (not an icon font, not an external file) so the theme keeps its
	 * zero-extra-request policy. Marked aria-hidden/focusable="false" because
	 * it is always paired with a text accessible name.
	 *
	 * @return string Raw SVG markup (safe: static, no user input).
	 */
	function lumen_search_icon_svg() {
		// 20px intrinsic box; the CSS sizes it responsively. Inline so no icon
		// font or remote SVG is ever fetched.
		return '<svg class="lumen-search-icon" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false">'
			. '<circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" stroke-width="1.6"/>'
			. '<line x1="12.6" y1="12.6" x2="17.5" y2="17.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>'
			. '</svg>';
	}
}

if ( ! function_exists( 'lumen_comment_form_defaults' ) ) {
	add_filter( 'comment_form_defaults', 'lumen_comment_form_defaults' );

	/**
	 * Comments (v1.1.15) — remove the visible headings and add a placeholder.
	 *
	 * Scope: this filter runs for every comment_form() call in the theme, which
	 * is only the one in comments.php. It changes *presentation strings and
	 * attributes*, never the permission model:
	 *
	 *   - 'title_reply' is emptied, so no "Leave a Reply"/"Leave a comment"
	 *     heading is printed. Core still emits <h3 id="reply-title">, which
	 *     keeps the canonical anchor and the cancel-reply target intact.
	 *   - Core's own field labels are NOT removed. They stay in the DOM and are
	 *     visually hidden by CSS, so the placeholder never becomes the only
	 *     accessible name (WCAG 3.3.2 / 1.3.1).
	 *   - Whether Name / Email / Website are shown, and whether they are
	 *     required, is decided entirely by Core from the site's Discussion
	 *     settings (comment_registration / require_name_email). Nothing here
	 *     overrides that.
	 *
	 * v1.1.17:
	 *   - 'logged_in_as' is emptied, removing the "Logged in as …" paragraph
	 *     (requirement A). See the note inside the function.
	 *
	 * @param array $defaults Core's comment form defaults.
	 * @return array
	 */
	function lumen_comment_form_defaults( $defaults ) {
		$defaults['title_reply'] = '';

		// Keep Core's semantic wrapper so #reply-title and the cancel link
		// survive; the CSS collapses the element while it is empty.
		$defaults['title_reply_before'] = '<h3 id="reply-title" class="comment-reply-title">';
		$defaults['title_reply_after']  = '</h3>';

		// v1.1.18 (D): the visible "Leave a Reply to <author>" heading is gone,
		// but the heading element must NOT be emptied.
		//
		// wp-includes/js/comment-reply.js reads, inside addPlaceHolder():
		//
		//     var replyElement = getElementById( 'reply-title' );
		//     var initialHeadingText = replyElement ? replyElement.firstChild.textContent : '';
		//
		// It dereferences `firstChild` unguarded. An empty <h3 id="reply-title">
		// has firstChild === null, so that line throws a TypeError, addPlaceHolder
		// never inserts the #wp-temp-form-div placeholder, and the rest of the
		// Reply cycle breaks: #respond is not relocated, and the Cancel handler
		// later bails out at its own `if ( ! temporaryElement ... ) return;`
		// guard. Measured on this theme before the fix: wp-temp-form-div absent
		// and #respond never moved, even though #comment_parent was set.
		//
		// So the heading keeps a REAL text node for Core to read and stash in the
		// placeholder, and that node is hidden from sight with the standard
		// clipped-visually-hidden pattern (see .lumen-comments .comment-reply-title
		// .screen-reader-text in main.css). The result is a heading with no
		// visible text, no blank placeholder and no layout height, while Core's
		// string handling stays on its supported path.
		// aria-hidden keeps the string out of the accessibility tree as well as
		// out of sight: the heading is decorative plumbing for Core's JS, and
		// the form's real accessible name comes from the fields themselves.
		$lumen_reply_heading = '<span class="screen-reader-text" aria-hidden="true">%s</span>';

		$defaults['title_reply']    = sprintf( $lumen_reply_heading, __( 'Leave a Reply', 'lumen' ) );
		$defaults['title_reply_to'] = sprintf( $lumen_reply_heading, __( 'Leave a Reply to %s', 'lumen' ) );

		// The <small> wrapper around the cancel link is dropped because the
		// link is relocated (see lumen_comment_cancel_reply_link below); the
		// empty strings keep Core's echo statements harmless.
		$defaults['cancel_reply_before'] = '';
		$defaults['cancel_reply_after']  = '';

		// The visible label. "Cancel reply" is replaced by the plain "Cancel"
		// the design calls for; the string still runs through Core's
		// translation layer because this value is passed to
		// cancel_comment_reply_link() as its $link_text argument.
		$defaults['cancel_reply_link'] = __( 'Cancel', 'lumen' );

		// v1.1.17 (A): drop the whole "Logged in as X. Edit your profile.
		// Log out? Required fields are marked *" paragraph for authenticated
		// visitors. That sentence comes from Core's 'logged_in_as' default,
		// and it bundles three unrelated things — an identity line, two
		// account links and the required-field legend. The task is to remove
		// the block outright, so it is emptied here rather than merely hidden:
		// Core still emits its own markup and still validates the submission
		// through wp-comments-post.php, but the string never reaches the page.
		//
		// 'comment_notes_before' (the guest email-privacy notice) is left at
		// Core's default, so guests keep that reassurance; only the
		// logged-in variant is removed.
		$defaults['logged_in_as'] = '';

		return $defaults;
	}
}

if ( ! function_exists( 'lumen_comment_form_field' ) ) {
	add_filter( 'comment_form_field_comment', 'lumen_comment_form_field' );

	/**
	 * Add the "Write your comment..." placeholder to Core's textarea.
	 *
	 * The placeholder is a convenience only: Core's real <label for="comment">
	 * is left untouched in the markup (and visually hidden by CSS), so the
	 * field always has a programmatic accessible name.
	 *
	 * @param string $field Core's rendered textarea paragraph.
	 * @return string
	 */
	function lumen_comment_form_field( $field ) {
		if ( false !== strpos( $field, 'placeholder=' ) ) {
			return $field;
		}
		return str_replace(
			'<textarea ',
			'<textarea placeholder="' . esc_attr__( 'Write your comment...', 'lumen' ) . '" ',
			$field
		);
	}
}

if ( ! function_exists( 'lumen_comment_edit_link' ) ) {
	add_filter( 'edit_comment_link', 'lumen_comment_edit_link', 10, 3 );

	/**
	 * Comments (v1.1.17, D) — render the edit link as a bare "Edit" pill.
	 *
	 * Core prints "(Edit)" from a translatable string. The parentheses are
	 * dropped from the rendered label while the link itself is kept exactly as
	 * Core built it (same URL, same capability check, same nonce-bearing
	 * target), so editing a comment is unchanged — only the label text differs.
	 *
	 * The bracket characters are stripped from the *output*, never from Core's
	 * source string, so no translation is broken and no locale regresses to
	 * a parenthesis-less mismatch.
	 *
	 * Scope: 'edit_comment_link' fires only where Core or the theme renders a
	 * comment edit link. In this theme that is the comment list in
	 * comments.php, because wp_list_comments() is what triggers it; wp-admin's
	 * own comment tables call the link through different code paths and are
	 * unaffected.
	 *
	 * @param string $link    Core's rendered edit link.
	 * @param string $before  Markup Core puts before the link.
	 * @param string $after   Markup Core puts after the link.
	 * @return string
	 */
	function lumen_comment_edit_link( $link, $before = '', $after = '' ) {
		// Strip the literal parentheses Core wraps the word in. Both the ASCII
		// pair and the fullwidth pair are handled so a localised string such as
		// "（編集）" reduces to "編集" rather than keeping its brackets.
		$label = preg_replace( '/[（(]\s*|\s*[)）]/u', '', $link );

		return false !== $label ? $label : $link;
	}
}

if ( ! function_exists( 'lumen_comment_cancel_reply_link' ) ) {
	add_filter( 'cancel_comment_reply_link', 'lumen_comment_cancel_reply_link', 10, 3 );

	/**
	 * Comments (v1.1.18, D) — take Core's ONE native cancel link out of the
	 * title block and hand it to the submit-field filter instead.
	 *
	 * WordPress builds the cancel control exactly once, inside #reply-title:
	 *
	 *     <h3 id="reply-title" class="comment-reply-title">
	 *         <small><a rel="nofollow" id="cancel-comment-reply-link"
	 *                   href="…#respond" style="display:none;">Cancel reply</a></small>
	 *     </h3>
	 *
	 * The submit button, by contrast, is rendered much later inside
	 * #commentform .form-submit. The requirement is a single Cancel pill sitting
	 * immediately to the RIGHT of Post Comment, so the native link has to move
	 * between two DOM regions that Core does not otherwise connect.
	 *
	 * This filter does not create a second link and it does not imitate one. It
	 * captures the exact string Core generated — same id
	 * `cancel-comment-reply-link`, same rel, same href (which Core already
	 * stripped of replytocom/unapproved/moderation-hash and anchored at
	 * #respond), same inline `style="display:none;"` that Core's own
	 * comment-reply.js flips to make the control appear) — returns an empty
	 * string so the title block renders no copy, and stores the captured HTML
	 * for lumen_comment_submit_field() to echo in the action row.
	 *
	 * Keeping Core's ID and inline display is what preserves the native
	 * behaviour: wp-includes/js/comment-reply.js looks the element up with
	 * getElementById( 'cancel-comment-reply-link' ) and writes .style.display
	 * directly. Any hand-built replacement with a different id, or a copy
	 * without that inline style, would break the show/hide cycle, and two
	 * elements sharing the id would make getElementById ambiguous. Exactly one
	 * link therefore exists in both the normal and the reply state.
	 *
	 * @param string $link      Core's complete cancel link HTML.
	 * @param string $link_url  The URL Core computed.
	 * @param string $link_text The visible label Core was given.
	 * @return string Empty string: the title block must render nothing.
	 */
	function lumen_comment_cancel_reply_link( $link, $link_url = '', $link_text = '' ) {
		// Only capture for the theme's own comment form. Core only ever calls
		// this while rendering a comment form, but guarding on the expected
		// shape keeps any unrelated caller from having its link swallowed.
		if ( false === strpos( $link, 'cancel-comment-reply-link' ) ) {
			return $link;
		}

		$GLOBALS['lumen_captured_cancel_link'] = $link;

		return '';
	}
}

if ( ! function_exists( 'lumen_comment_submit_field' ) ) {
	add_filter( 'comment_form_submit_field', 'lumen_comment_submit_field', 10, 2 );

	/**
	 * Comments (v1.1.18, D) — put the captured native cancel link beside the
	 * submit button, inside Core's own .form-submit wrapper.
	 *
	 * Core hands this filter the fully assembled submit field:
	 *
	 *     <p class="form-submit">%1$s %2$s</p>
	 *
	 * where %1$s is the submit button and %2$s is get_comment_id_fields() — the
	 * hidden `comment_post_ID` and `comment_parent` inputs. Those hidden fields
	 * are the entire contract for threading, so they are never touched here:
	 * the markup is emitted verbatim with the cancel link appended after it and
	 * still inside the <p>.
	 *
	 * The link is inserted only when Core actually produced one this request,
	 * which is exactly when `get_option( 'thread_comments' )` is on. With
	 * threading disabled no link was captured, nothing is appended, and no
	 * reply control is offered anywhere.
	 *
	 * @param string $submit_field Core's assembled submit field markup.
	 * @param array  $args         Arguments passed to comment_form().
	 * @return string
	 */
	function lumen_comment_submit_field( $submit_field, $args = array() ) {
		$cancel = isset( $GLOBALS['lumen_captured_cancel_link'] ) ? $GLOBALS['lumen_captured_cancel_link'] : '';

		// Consume it so a second comment_form() on the same request (a
		// different post, or a theme/plugin rendering another form) starts
		// from a clean slate and cannot inherit a stale link.
		unset( $GLOBALS['lumen_captured_cancel_link'] );

		if ( '' === $cancel ) {
			return $submit_field;
		}

		// Append inside the existing wrapper rather than emitting a second
		// container, so Post Comment and Cancel are siblings in one flex row
		// and Core's .form-submit markup is otherwise untouched.
		$closing = '</p>';
		$pos     = strrpos( $submit_field, $closing );

		if ( false === $pos ) {
			// Unexpected shape: leave Core's markup alone rather than
			// rebuilding it. The cancel link stays unrendered and the form is
			// still fully functional, just without the pill.
			return $submit_field;
		}

		return substr( $submit_field, 0, $pos ) . $cancel . $closing . substr( $submit_field, $pos + strlen( $closing ) );
	}
}
