<?php
/**
 * Lumen — asset enqueue.
 *
 * Enqueues the theme stylesheets, plus WordPress Core's own `comment-reply`
 * script on singular views where threaded commenting is actually available.
 *
 * JavaScript policy: the theme ships NO custom JavaScript files
 * (THEME CUSTOM JS FILES = 0) and still has no JS-driven navigation. The one
 * script enqueued here is WordPress Core's bundled `comment-reply`, which is
 * what makes the native "Reply" link move the comment form. It is Core's own
 * file, not a theme asset: no custom reply JS, no jQuery plugin, no CDN, and
 * nothing copied or modified from Core.
 *
 * Uses get_template_directory_uri() (no hardcoded URLs).
 *
 * @package lumen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'lumen_enqueue_assets' ) ) {
	add_action( 'wp_enqueue_scripts', 'lumen_enqueue_assets' );

	function lumen_enqueue_assets() {
		// Base theme stylesheet (style.css: design tokens, reset, typography).
		// Enqueued explicitly because this theme ships a theme.json, which
		// otherwise causes WP to skip the classic auto-load of style.css.
		wp_enqueue_style(
			'lumen-base',
			LUMEN_URI . '/style.css',
			array(),
			LUMEN_VERSION
		);
		// Component / layout styles (depend on the base for tokens + reset).
		wp_enqueue_style(
			'lumen-main',
			LUMEN_URI . '/assets/css/main.css',
			array( 'lumen-base' ),
			LUMEN_VERSION
		);

		// --- WordPress Core threaded-comment reply -------------------------
		// Core's comment-reply.js is what relocates #respond under the comment
		// being replied to and fills #comment_parent. WordPress does NOT load
		// it automatically; the theme must enqueue it. Without this the Reply
		// link is a dead anchor (the v1.1.15 regression).
		//
		// Conditions mirror Core's own requirements exactly:
		//   is_singular()                 - only single posts/pages carry the
		//                                   single comment thread UI.
		//   comments_open()               - nothing to reply to otherwise.
		//   get_option('thread_comments') - Core only emits nested Reply links
		//                                   when threading is enabled, so
		//                                   loading the script otherwise would
		//                                   be a wasted request.
		// Home, archives, search and 404 never match is_singular(), so they are
		// completely unaffected.
		if (
			is_singular()
			&& comments_open()
			&& get_option( 'thread_comments' )
		) {
			wp_enqueue_script( 'comment-reply' );
		}
	}
}
