
const { __, sprintf, } = wp.i18n;
//const { PanelBody, RangeControl, ToggleControl } = wp.components;
const { Fragment } = wp.element;

const { registerBlockType } = wp.blocks;
const { RichText, InnerBlocks } = wp.editor;

import './style.scss';

registerBlockType( 'hms/image-tile', {
    title: 'Image Tile',
    icon: 'align-left',
    category: 'common',
    attributes: {
        content: {
          type: 'array',
          source: 'children',
          selector: 'p',
        },
    },

    edit( { attributes, className, setAttributes, placeholder } ) {
        const { content } = attributes;

        function onChangeContent( newContent ) {
          setAttributes( { content: newContent } );
        }

        return (
            <div className={ className }>
              <div className={'tile-heading'}>
              <InnerBlocks
                layouts={ [
                  { name: 'inner', label: 'Inner Content', icon: 'columns' },
                ] }

                templateLock={ 'all' }

                template={
                  [
                    [ 'core/image', { layout:'inner' } ],
                    [ 'core/heading', { layout:'inner', placeholder:'Tile Label...' } ],
                  ]
                }
              />
              </div>
              <RichText
              tagName="p"
              placeholder={ __('Tile Excerpt', 'hmsblocks' ) }
              className={ className }
              onChange={ onChangeContent }
              value={ content }
              />
            </div>
        );
    },

    save( { attributes, className } ) {
        const { content } = attributes;

        return (

          <div className={ className }>
            <div className={'tile-heading'}>
            <InnerBlocks.Content />
            </div>
            <RichText.Content
            tagName="p"
            className={ className }
            value={ content }
            />
          </div>

        );
    },
} );
