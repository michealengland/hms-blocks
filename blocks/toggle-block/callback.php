<?php
/**
 * Enqueue Toggle Block jQuery
 * @param wp_register_script( string $handle, string $src, array $deps = array(), string|bool|null $ver = false, bool $in_footer = false )
 */
function enqueue_toggle_block_js() {

    // Register Jquery Library for later use to avoid and may be utilized by multiple blocks.
    wp_register_script( 'hms_jquery', 'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js', array(), '3.3.1', true );

    // enqueue file in footer
    wp_enqueue_script( 'hms_simple_toggle', plugin_dir_url( __FILE__ ) . 'js/simple-toggle.js', array('hms_jquery'), '3.3.1', false );

} //End Function

add_action( 'wp_enqueue_scripts', 'enqueue_toggle_block_js' );