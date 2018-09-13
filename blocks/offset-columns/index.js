
/**
 * Block dependencies
 */
import classnames from 'classnames';
//import { times, property, omit } from 'lodash';
import times from 'lodash/times';
import memoize from 'lodash/memoize';
import omit from 'lodash/omit';

const { __, sprintf, } = wp.i18n;
const { PanelBody, RangeControl, ToggleControl } = wp.components;
const { Fragment } = wp.element;

const {
  registerBlockType,
} = wp.blocks;

const {
  InspectorControls,
	InnerBlocks,
} = wp.editor;

/**
* Block Styles
*/
import './style.scss';
import './editor.scss';


/**
 * Allowed blocks constant is passed to InnerBlocks precisely as specified here.
 * The contents of the array should never change.
 * The array should contain the name of each block that is allowed.
 * In columns block, the only block we allow is 'core/column'.
 *
 * @constant
 * @type {string[]}
*/
const ALLOWED_BLOCKS = [ 'core/column' ];

/**
 * Returns the layouts configuration for a given number of columns.
 *
 * @param {number} columns Number of columns.
 *
 * @return {Object[]} Columns layout configuration.
 */

const getColumnsTemplate = memoize( ( columns ) => {
	return times( columns, () => [ 'core/column' ] );
} );

/**
 * Register example block
 */
export default registerBlockType(
    'hms/offset-columns',
    {
        title: __( 'Offset Columns', 'hmsblocks' ),
        description: __( 'This column block allows you to create offset layouts.', 'hmsblocks'),
        keywords: [
            __( 'Columns', 'hmsblocks' ),
        ],
        icon: 'columns',
      	category: 'layout',
      	attributes: {
      		columns: {
      			type: 'number',
      			default: 2,
      		},
          hasReverse: {
            type: 'boolean',
            default: false,
          },
      	},

        supports: {
          align: [ 'wide', 'full' ],
        },

        edit( { attributes, setAttributes, className } ) {
      		const { columns, hasReverse, } = attributes;
          const toggleReverse = () => setAttributes( { hasReverse: ! hasReverse } );

          const classes = classnames(
            className,
            'wp-block-columns',
            `has-${ columns }-columns`,
            {
              'has-reverse': hasReverse,
            }
          );


      		return (
      			<Fragment>
      				<InspectorControls>
      					<PanelBody title={ __( 'Offset Column Settings' ) }>
      						<RangeControl
      							label={ __( 'Columns' ) }
      							value={ columns }
      							onChange={ ( nextColumns ) => {
      								setAttributes( {
      									columns: nextColumns,
      								} );
      							} }
      							min={ 2 }
      							max={ 3 }
      						/>


      					</PanelBody>
                <ToggleControl
                  label={ __( 'Reverse Layout' ) }
                  checked={ !! hasReverse }
                  onChange={ toggleReverse }
                />
      				</InspectorControls>
      				<div className={ classes }>
      					<InnerBlocks
      						template={ getColumnsTemplate( columns ) }
      						templateLock="all"
      						allowedBlocks={ ALLOWED_BLOCKS }
                />
      				</div>
      			</Fragment>
      		);
      	},

        save( { attributes } ) {
          const { columns, className, setAttributes, hasReverse } = attributes;

          const classes = classnames(
            className,
            'wp-block-columns',
            `has-${ columns }-columns`,
            {
              'has-reverse': hasReverse,
            }
          );

          return (
            <div className={ classes }>
              <InnerBlocks.Content />
            </div>
          );
        },
    },
);
