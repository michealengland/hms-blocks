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
        [ 'wp-i18n', 'wp-element', 'wp-blocks', 'wp-components', 'wp-editor' ],
        filemtime( plugin_dir_path( __FILE__ ) . $blockPath )
    );

    // Enqueue optional editor only styles
    wp_enqueue_style(
        'hms-blocks-editor-css',
        plugins_url( $editorStylePath, __FILE__ ),
        [],
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
            filemtime( plugin_dir_path( __FILE__ ) . $blockPath )
        );
    }

    // Enqueue frontend and editor block styles
    wp_enqueue_style(
        'hms-blocks',
        plugins_url( $stylePath, __FILE__ ),
        [],
        filemtime(plugin_dir_path( __FILE__ ) . $stylePath )
    );

}

// Hook scripts function into block hook
add_action( 'enqueue_block_assets', 'hms_blocks_scripts' );