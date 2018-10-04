<?php
function my_add_template_to_posts() {
    $post_type_object = get_post_type_object( 'post' );

    $post_type_object->template = array(

        array( 'hmsblocks/hms-layout-1', array(), array(

            // Core Heading Block
            array( 'core/heading', array(
                'placeholder' => 'Place Holder heading',
                'layout' => 'story-container'
            ) ),


        ) )
    );
}

//add_action( 'init', 'my_add_template_to_posts' );


/**
 * Server-side rendering of the `hms/custom-post-feed` block.
 *
 * @package gutenberg
 */
/**
 * Renders the `hms/custom-post-feed` block on server.
 *
 * @param array $attributes The block attributes.
 *
 * @return string Returns the post content with latest posts added.
 */
function render_block_custom_post_feed( $attributes ) {

	$recent_posts = wp_get_recent_posts(
		array(
            //'post_type'   => 
			'numberposts' => $attributes['postsToShow'],
			'post_status' => 'publish',
			'order'       => $attributes['order'],
			'orderby'     => $attributes['orderBy'],
			'category'    => $attributes['categories'],
		)
	);
	$list_items_markup = '';
	foreach ( $recent_posts as $post ) {
		$post_id = $post['ID'];
		$title = get_the_title( $post_id );
		if ( ! $title ) {
			$title = __( '(Untitled)', 'gutenberg' );
        }

        $list_items_markup .= '<li>';
        

		// If Post Thumb Option Enabled
		/* TEMP DISABLED
		if ( isset( $attributes['displayPostThumbnail'] ) && $attributes['displayPostThumbnail'] ) {
			if( has_post_thumbnail($post_id) ) {
				$list_items_markup .= get_the_post_thumbnail( $post_id, 'thumbnail' );
			}
		}
		*/

		if( has_post_thumbnail( $post_id ) ) {
			$list_items_markup .= get_the_post_thumbnail( $post_id, 'thumbnail' );
		}

		$list_items_markup .= sprintf(
            '<a href="%1$s">%2$s</a>',
            //get_the_post_thumbnail( $post_id, 'post-thumbnail' ),
			esc_url( get_permalink( $post_id ) ),
			esc_html( $title )
        );

		if ( isset( $attributes['displayPostDate'] ) && $attributes['displayPostDate'] ) {
			$list_items_markup .= sprintf(
				'<time datetime="%1$s" class="wp-block-latest-posts__post-date">%2$s</time>',
				esc_attr( get_the_date( 'c', $post_id ) ),
				esc_html( get_the_date( '', $post_id ) )
			);
		}
		
        
		$list_items_markup .= "</li>\n";
	}
	$class = 'wp-block-latest-posts hms-custom-post-feed';
	if ( isset( $attributes['align'] ) ) {
		$class .= ' align' . $attributes['align'];
	}
	if ( isset( $attributes['postLayout'] ) && 'grid' === $attributes['postLayout'] ) {
		$class .= ' is-grid';
	}
	if ( isset( $attributes['columns'] ) && 'grid' === $attributes['postLayout'] ) {
		$class .= ' columns-' . $attributes['columns'];
	}
	if ( isset( $attributes['className'] ) ) {
		$class .= ' ' . $attributes['className'];
	}
	$block_content = sprintf(
		'<ul class="%1$s">%2$s</ul>',
		esc_attr( $class ),
		$list_items_markup
	);
	return $block_content;
}

/**
 * Registers the `core/latest-posts` block on server.
 */
function register_block_custom_post_feed() {
	register_block_type(
		'hms/custom-post-feed',
		array(
			'attributes'      => array(
				'categories'      => array(
					'type' => 'string',
				),
				'className'       => array(
					'type' => 'string',
				),
				'postsToShow'     => array(
					'type'    => 'number',
					'default' => 5,
				),
				'displayPostDate' => array(
					'type'    => 'boolean',
					'default' => false,
				),
				'postLayout'      => array(
					'type'    => 'string',
					'default' => 'list',
				),
				'columns'         => array(
					'type'    => 'number',
					'default' => 3,
				),
				'align'           => array(
					'type' => 'string',
				),
				'order'           => array(
					'type'    => 'string',
					'default' => 'desc',
				),
				'orderBy'         => array(
					'type'    => 'string',
					'default' => 'date',
				),
			),
            'render_callback' => 'render_block_custom_post_feed',
		)
	);
}

add_action( 'init', 'register_block_custom_post_feed' );



