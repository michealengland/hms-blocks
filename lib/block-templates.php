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

