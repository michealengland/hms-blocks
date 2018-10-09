<?php
/**
 * Plugin Name: HMS Blocks
 * Plugin URI:
 * Description: Custom blocks for HMS.
 * Text Domain: hms-blocks
 * Domain Path: /languages
 * Author: Mike England @mikelikethebike
 * Author URI: https://twitter.com/mikelikethebike
 * Version: 1.0.5
 * License: GPL2+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package hmsblocks
 */

// Exit if accessed directly.
defined('ABSPATH') || exit;

include_once( plugin_dir_path( __FILE__ ) . 'updater.php' );

$updater = new HMS_Blocks_Updater( __FILE__ );
$updater->set_username( 'michealengland' );
$updater->set_repository( 'hms-blocks' );
// $updater->authorize( 'abcdefghijk1234567890' ); // Your auth code goes here for private repos

$updater->initialize();

require dirname( __FILE__ ) . '/options.php';

$toggle_options = get_option( 'my_option_name');
$form_embed_opt = $toggle_options['eb_form_embed'];

// Enqueue JS and CSS
include( plugin_dir_path( __FILE__ ) . 'lib/enqueue-scripts.php');

// Block Templates
include( plugin_dir_path( __FILE__ ) . 'lib/block-templates.php');


// Post Feed Callback
include( plugin_dir_path( __FILE__ ) . 'blocks/post-feed/callback.php');

// Events Post Feed Callback
include( plugin_dir_path( __FILE__ ) . 'blocks/events-post-feed/callback.php');



