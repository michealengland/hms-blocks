# HMS Blocks
All notable changes to this project will be documented in this file.

##Change Log

## 1.0.62
- Added wp-editor as a dependency to make plugin compatibale with Gutenberg 4.5 release update.

## 1.0.61
- Updated editor style on innerblocks-cover-image to fix content being hidden behind the overlay.

## 1.0.6
- Working on custom post feed blocks. 
- Testing Events Custom Post Type block.

## 1.0.5
- Removed testing block.
- Removed readme.txt
- Added editor.scss files to blocks.
- Improved editor color styling on blocks with color options. 
- Fixed block align on CTA, and Innerblocks.
- Updated to version 1.0.5
- Removed color styles from toggle.
- Removed unused constants from toggle.
- Removed Font Awesome from toggle icon.

## 1.0.4 
- Created custom post feed block.
- Added packages for "moment": "^2.22.1" and "moment-timezone": "^0.5.16" to package.json
- Disabled thubmnail options on post feed block. The block will automatically display featured images.

## 1.0.3 
- Made updates to blocks that utilize color settings to use 'getColorClassName' instead of 'getColorClassName'.
- Removed old files and left deprecated versions.
- Moved color settings for editor out of the plugin and into the child theme for now.
- Cleaned up blocks and removed unused constants.
- Tested on Gutenberg 3.9
