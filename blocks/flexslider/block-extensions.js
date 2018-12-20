import './style.scss';

wp.blocks.registerBlockStyle( 
    
    'core/gallery', {
    name: 'flexslider',
    label: 'Flex Slider',    
    }, 


);

/**
 * Wrap table block in div.
 *
 * @param {object} element
 * @param {object} blockType
 * @param {object} attributes
 *
 * @return The element.
 */

wp.hooks.addFilter(
	'blocks.getSaveElement',
	'slug/modify-get-save-content-extra-props',
	modifyGetSaveContentExtraProps
);


function modifyGetSaveContentExtraProps( element, blockType, attributes  ) {
	// Check if that is not a table block.
	if (blockType.name !== 'core/gallery') {
		return element;
	}

	// Return the table block with div wrapper.
	return (
		<div className='flexslider'>
			{element}
		</div>
	);
}



