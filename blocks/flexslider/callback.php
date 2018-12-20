<?php
/**
* Register Flexslider Block jQuery
* @param wp_register_script( string $handle, string $src, array $deps = array(), string|bool|null $ver = false, bool $in_footer = false );
*/
function hms_flexslider() {

    // Register Jquery Library for later use to avoid and may be utilized by multiple blocks.
    wp_register_script( 'hms_jquery', 'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js', array(), '3.3.1', true );

    // Enqueue Flexslider jQuery into footer.
    wp_register_script( 'hms_flex_slider', plugin_dir_url( __FILE__ ) . 'woo-flex-slider/flexslider.js', array() , null, false );
    // Enqueue Flexslider settings into footer.
    wp_enqueue_script( 'hms_slide_settings', plugin_dir_url( __FILE__ ) . 'woo-flex-slider/flexslider-settings.js', array('hms_jquery', 'hms_flex_slider'), '3.3.1', false );
    
}
add_action( 'wp_enqueue_scripts', 'hms_flexslider' ); // front-end enqueue