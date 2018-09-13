<?php

/**
 * Enqueue block editor only JavaScript and CSS
 */
function hms_blocks_editor_scripts() {

    // Make paths variables so we don't write em twice ;)
    $blockPath = '../assets/js/editor.blocks.js';
    $editorStylePath = '../assets/css/blocks.editor.css';

    // Enqueue the bundled block JS file
    wp_enqueue_script(
        'hms-blocks-js',
        plugins_url( $blockPath, __FILE__ ),
        [ 'wp-i18n', 'wp-element', 'wp-blocks', 'wp-components' ],
        filemtime( plugin_dir_path( __FILE__ ) . $blockPath )
    );

    // Enqueue optional editor only styles
    wp_enqueue_style(
        'hms-blocks-editor-css',
        plugins_url( $editorStylePath, __FILE__),
        [ 'wp-blocks' ],
        filemtime( plugin_dir_path( __FILE__ ) . $editorStylePath )
    );

}
// Hook scripts function into block editor hook
add_action( 'enqueue_block_editor_assets', 'hms_blocks_editor_scripts' );


/**
 * Enqueue front end and editor JavaScript and CSS
 */
function hms_blocks_scripts()
{
    // Make paths variables so we don't write em twice ;)
    $blockPath = '../assets/js/frontend.blocks.js';
    $stylePath = '../assets/css/blocks.style.css';

    if( !is_admin() ) {
        // Enqueue the bundled block JS file
        wp_enqueue_script(
            'hms-blocks-frontend',
            plugins_url( $blockPath, __FILE__ ),
            [],
            filemtime( plugin_dir_path(__FILE__) . $blockPath )
        );
    }

    // Enqueue frontend and editor block styles
    wp_enqueue_style(
        'hms-blocks',
        plugins_url($stylePath, __FILE__),
        [ 'wp-blocks' ],
        filemtime(plugin_dir_path(__FILE__) . $stylePath )
    );

}

// Hook scripts function into block editor hook
add_action('enqueue_block_assets', 'hms_blocks_scripts');



/**
* Register Jquery Library for
* @flexslider
*/

function enqueue_flexslider() {

  if( is_page() or is_single() ) {

		wp_register_script( 'fs_ajax', 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.0/jquery.min.js', array('jquery'), '1.7.0', false );
		wp_enqueue_script( 'fs_ajax' );

		wp_register_script( 'fs_jquery', plugin_dir_url( __FILE__ ) . '../blocks/flexslider/js/flexslider-min.js', array('jquery'), '1.7.0', false );
		wp_enqueue_script( 'fs_jquery' );

    // Enque this script in footer
    wp_register_script( 'fs_slide_settings', plugin_dir_url( __FILE__ ) . '../blocks/flexslider/js/flexslider-settings.js', array('jquery'), '1.7.0', false );
    wp_enqueue_script( 'fs_slide_settings' );

  }
} //End Function

//add_action( 'wp_enqueue_scripts', 'enqueue_flexslider' );


/**
* Register Jquery Library for
* @flexslider
*/

function enqueue_toggle_block_js() {

  // enqueue jQuery
  wp_register_script( 'hms_simple_toggle_jquery', 'http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js', false, '2.1.3', false );
  wp_enqueue_script( 'hms_simple_toggle_jquery' );

  // enqueue file in footer
  wp_register_script( 'hms_simple_toggle', plugin_dir_url( __FILE__ ) . '../blocks/toggle-block/js/simple-toggle-min.js', array(), null, true );
  wp_enqueue_script( 'hms_simple_toggle' );

} //End Function

add_action( 'wp_enqueue_scripts', 'enqueue_toggle_block_js' );
