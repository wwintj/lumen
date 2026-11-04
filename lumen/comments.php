<?php
/**
 * Lumen — comments: list, pagination and Core's comment form.
 *
 * @package lumen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( post_password_required() || ( ! have_comments() && ! comments_open() ) ) {
	return;
}
?>
<section id="comments" class="lumen-comments">
	<?php if ( have_comments() ) : ?>
		<h2 class="lumen-comments-title">
			<?php
			$lumen_count = (int) get_comments_number();
			echo esc_html(
				sprintf(
					/* translators: %s: number of comments. */
					_n( '%s comment', '%s comments', $lumen_count, 'lumen' ),
					number_format_i18n( $lumen_count )
				)
			);
			?>
		</h2>

		<ol class="lumen-comment-list">
			<?php
			add_filter( 'get_comment_author_link', 'lumen_plain_comment_author', 10, 3 );
			add_filter( 'gettext', 'lumen_comment_date_format', 10, 3 );
			wp_list_comments(
				array(
					'style'       => 'ol',
					'short_ping'  => true,
					'avatar_size' => 32,
					'reply_text'  => __( 'Reply', 'lumen' ),
				)
			);
			remove_filter( 'gettext', 'lumen_comment_date_format', 10 );
			remove_filter( 'get_comment_author_link', 'lumen_plain_comment_author', 10 );
			?>
		</ol>

		<?php the_comments_pagination( array( 'class' => 'lumen-pagination' ) ); ?>

		<?php if ( ! comments_open() ) : ?>
			<p class="lumen-comments-closed"><?php esc_html_e( 'Comments are closed.', 'lumen' ); ?></p>
		<?php endif; ?>
	<?php endif; ?>

	<?php comment_form(); ?>
</section>
