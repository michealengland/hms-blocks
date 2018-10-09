<?php
/**
 * Renders the `hms/custom-post-feed` block on server.
 *
 * @param array $attributes The block attributes.
 *
 * @return string Returns the post content with latest posts added.
 */
function render_block_event_post_feed( $attributes ) {

	$recent_posts = wp_get_recent_posts(
		array(
            'post_type'   => 'hms_events_cpt_1',
			'numberposts' => $attributes['postsToShow'],
			'post_status' => 'publish',
			'order'       => $attributes['order'],
			'orderby'     => $attributes['orderBy'],
			'tax_query' => array(
				array(
					'taxonomy' => 'hms_event_types',
					'field'    => 'term_id',
					'terms'    => $attributes['categories'],
				),
			),
			'OBJECT',
			//'category'    => $attributes['categories'],
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

		/*
		if( has_post_thumbnail( $post_id ) ) {
			$list_items_markup .= get_the_post_thumbnail( $post_id, 'thumbnail' );
		}
		*/

		if ( isset( $attributes['displayPostImage'] ) && $attributes['displayPostImage'] ) {
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
function register_block_event_post_feed() {

	// Check if the register function exists
	if ( ! function_exists( 'register_block_type' ) ) {
		return;
	}

	register_block_type(
		'hms/events',
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
				'displayPostImage' => array(
					'type'    => 'boolean',
					'default' => false,
				),
				'imageCrop'  => array(
					'type' => 'string',
					'default' => 'landscape',
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
				'startDate' => array(
					'type' => 'string',
					'source' => 'meta',
					'meta' => 'event_date_start',
				),
			),
            'render_callback' => 'render_block_event_post_feed',
		)
	);
}

add_action( 'init', 'register_block_event_post_feed' );









/**
 * Create API fields for additional info
 */
function hms_blocks_register_rest_fields() {
	// Add landscape featured image source
	register_rest_field(
		'hms_events_cpt_1',
		'featured_image_src',
		array(
			'get_callback' => 'hms_blocks_get_image_src_landscape',
			'update_callback' => null,
			'schema' => null,
		)
	);

	// Add square featured image source
	register_rest_field(
		'hms_events_cpt_1',
		'featured_image_src_square',
		array(
			'get_callback' => 'hms_blocks_get_image_src_square',
			'update_callback' => null,
			'schema' => null,
		)
	);

}
add_action( 'rest_api_init', 'hms_blocks_register_rest_fields' );




/**
 * Get landscape featured image source for the rest field
 */
function hms_blocks_get_image_src_landscape( $object, $field_name, $request ) {
	$feat_img_array = wp_get_attachment_image_src(
		$object['featured_media'],
		'hms-block-post-grid-landscape',
		false
	);
	return $feat_img_array[0];
}

/**
 * Get square featured image source for the rest field
 */
function hms_blocks_get_image_src_square( $object, $field_name, $request ) {
	$feat_img_array = wp_get_attachment_image_src(
		$object['featured_media'],
		'hms-block-post-grid-square',
		false
	);
	return $feat_img_array[0];
}




function hms_blocks_register_post_meta() {
	$args = array(
		'type' => 'string',
		'single' => true,
		'show_in_rest' => true,
	);

	register_meta( 'post', 'hms_events_meta', $args );
}

add_action( 'init', 'hms_blocks_register_post_meta' );