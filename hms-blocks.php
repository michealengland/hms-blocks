<?php
/**
 * Plugin Name: HMS Blocks
 * Plugin URI:
 * Description: Custom blocks for HMS.
 * Text Domain: hms-blocks
 * Domain Path: /languages
 * Author: Mike England @mikelikethebike
 * Author URI: https://twitter.com/mikelikethebike
 * Version: 1.0.66
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

$updater->initialize();

// Enqueue JS and CSS
include( plugin_dir_path( __FILE__ ) . 'lib/enqueue-scripts.php' );

// Post Feed Callback
include( plugin_dir_path( __FILE__ ) . 'blocks/post-feed/callback.php' );

// Flexslider Callback
include( plugin_dir_path( __FILE__ ) . 'blocks/flexslider/callback.php' );

// Toggle Block Callback
include( plugin_dir_path( __FILE__ ) . 'blocks/toggle-block/callback.php' );