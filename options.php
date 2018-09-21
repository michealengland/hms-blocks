<?php
if( !defined('ABSPATH') ) exit;

class MySettingsPage
{
    /**
     * Holds the values to be used in the fields callbacks
     */
    private $options;

    /**
     * Start up
     */
    public function __construct()
    {
        add_action( 'admin_menu', array( $this, 'add_plugin_page' ) );
        add_action( 'admin_init', array( $this, 'page_init' ) );
    }

    /**
     * Add options page
     */
    public function add_plugin_page()
    {
        // This page will be under "Settings"
        add_options_page(
            'Settings Admin',
            'HMS Blocks',
            'manage_options',
            'my-setting-admin',
            array( $this, 'create_admin_page' )
        );
    }

    /**
     * Options page callback
     */
    public function create_admin_page()
    {
        // Set class property
        $this->options = get_option( 'my_option_name' );
        ?>
        <div class="wrap">
            <h1>HMS Blocks Settings</h1>
            <p>Select which blocks you would like to enable on this site.</p>
            <i>NOTE: Blocks will still be shown on the front end if this plugin is deactivated.</i>
            <form method="post" action="options.php">
            <?php
                // This prints out all hidden setting fields
                settings_fields( 'my_option_group' );
                do_settings_sections( 'my-setting-admin' );
                submit_button();
            ?>
            </form>
        </div>
        <?php
    }

    /**
     * Register and add settings
     */
    public function page_init()
    {
        register_setting(
            'my_option_group', // Option group
            'my_option_name', // Option name
            array( $this, 'sanitize' ) // Sanitize
        );

        add_settings_section(
            'setting_section_id', // ID
            'Select Blocks', // Title
            array( $this, 'print_section_info' ), // Callback
            'my-setting-admin' // Page
        );

        add_settings_field(
            'title',
            'Title',
            array( $this, 'title_callback' ),
            'my-setting-admin',
            'setting_section_id'
        );

        add_settings_field(
            'eb_form_embed',
            'Form Embed Link',
            array( $this, 'eb_form_embed_callback' ),
            'my-setting-admin',
            'setting_section_id'
        );

        add_settings_field(
            'eb_form_content',
            'Form Content',
            array( $this, 'eb_form_content_callback' ),
            'my-setting-admin',
            'setting_section_id'
        );
        
    }

    /**
     * Sanitize each setting field as needed
     *
     * @param array $input Contains all settings fields as array keys
     */
    public function sanitize( $input )
    {

        if( isset( $input['title'] ) )
            $new_input['title'] = sanitize_text_field( $input['title'] );

        if( isset( $input['eb_form_embed'] ) )
            $new_input['eb_form_embed'] = esc_html( $input['eb_form_embed'] );

        if( isset( $input['eb_form_content'] ) )
            $new_input['eb_form_content'] = sanitize_text_field( $input['eb_form_content'] );

        return $new_input;
    }

    /**
     * Print the Section text
     */
    public function print_section_info()
    {
        print 'Enter your settings below:';
    }

    /**
     * Get the settings option array and print one of its values
     */
    public function title_callback()
    {
        printf(
            '<input type="text" id="title" name="my_option_name[title]" value="%s" />',
            isset( $this->options['title'] ) ? esc_attr( $this->options['title']) : ''
        );
    }

    /**
     * Get the settings option array and print one of its values
     */
    public function eb_form_embed_callback()
    {
        printf(
            '<input type="checkbox" id="eb_form_embed" name="my_option_name[eb_form_embed]" value="%s" />',
            isset( $this->options['eb_form_embed'] ) ? esc_attr( $this->options['eb_form_embed']) : ''
        );
    }

    /**
     * Get the settings option array and print one of its values
     */
    public function eb_form_content_callback()
    {
        printf(
            '<input type="text" id="eb_form_content" name="my_option_name[eb_form_content]" value="%s" />',
            isset( $this->options['eb_form_content'] ) ? esc_attr( $this->options['eb_form_content']) : ''
        );
    }

}

if( is_admin() )
    $my_settings_page = new MySettingsPage();
