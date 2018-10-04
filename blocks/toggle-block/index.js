const { __ } = wp.i18n;

const { registerBlockType } = wp.blocks;
const { RichText, InnerBlocks  } = wp.editor;

import './style.scss';
import './editor.scss';

registerBlockType( 'hms/toggleblock', {
    title: 'Toggle Block',
    icon: 'universal-access-alt',
    category: 'layout',
    attributes: {
      toggleTitle: {
        type: 'array',
        source: 'children',
        selector: 'h2',
      },
      toggleContent: {
        type: 'array',
        source: 'children',
        selector: 'p',
      },
    },

    edit( { attributes, className, setAttributes, placeholder } ) {
        const { toggleTitle } = attributes;

        function onChangeToggleTitle( newToggleTitle ) {
          setAttributes( { toggleTitle: newToggleTitle } );
        }

        return (
          <div className={ className }>
            <heading class="hms-toggle-expander">
              <RichText
              tagName="h2"
              className={ 'toggle-title' }
              onChange={ onChangeToggleTitle }
              value={ toggleTitle }
              placeholder={ 'Toggle Heading' }
              keepPlaceholderOnFocus={ true }
              />
            </heading>

            <div class="hms-toggle-wrapper">
              <div class="hms-toggle-content">
                <InnerBlocks />
              </div>
            </div>
          </div>
        );
    },

    save( { attributes, className } ) {
        const { toggleTitle } = attributes;

        return (

          <div className={ className }>
            
            <heading class="hms-toggle-expander">
              <RichText.Content
              tagName="h2"
              className={ 'toggle-title' }
              value={ toggleTitle }
              />
            </heading>

            <div class="hms-toggle-wrapper">
              <div class="hms-toggle-content">
                <InnerBlocks.Content />
              </div>
            </div>
          </div>
        );
    },
} );
