/**
* Cover Image Block Utilizes default WP Cover Image Styles
*/

import classnames from 'classnames';

const { __, } = wp.i18n;

const {
	registerBlockType,
} = wp.blocks;
const {	
	withColors,
	AlignmentToolbar,
	BlockAlignmentToolbar,
	BlockControls,
	InspectorControls,
	PanelColorSettings,
	InnerBlocks,
	getColorClassName,
	MediaPlaceholder,
	MediaUpload,
} = wp.editor;
const {
	PanelBody,
	withFallbackStyles,
	ColorPalette,
  IconButton, RangeControl, ToggleControl, Toolbar
} = wp.components;

const {
	Component,
	Fragment,
} = wp.element;

import './style.scss';

const { compose } = wp.compose;

const {getComputedStyle} = window;

const FallbackStyles = withFallbackStyles((node, ownProps) => {
	const {overlayColor} = ownProps.attributes;
	const editableNode = node.querySelector('[contenteditable="true"]');
	//verify if editableNode is available, before using getComputedStyle.
	const computedStyles = editableNode ? getComputedStyle(editableNode) : null;
	return {
		fallbackOverlayColor: overlayColor || ! computedStyles ? undefined : computedStyles.overlayColor,
	};
});

const applyFallbackStyles = withFallbackStyles( ( node, ownProps ) => {
	const {overlayColor} = ownProps.attributes;
	const editableNode = node.querySelector('[contenteditable="true"]');
	//verify if editableNode is available, before using getComputedStyle.
	const computedStyles = editableNode ? getComputedStyle( editableNode ) : null;
	return {
		fallbackOverlayColor: overlayColor || ! computedStyles ? undefined : computedStyles.overlayColor,
	};
} );


// Block Alignement
const validAlignments = [ 'left', 'center', 'right', 'wide', 'full' ];


function getEditWrapperProps( attributes ) {
	const { align } = attributes;
	if( -1 !== validAlignments.indexOf( align ) ) {
		return { 'data-align': align };
	}
}

class InnerBlocksCoverIMG extends Component {
	constructor() {
		super(...arguments);
		this.onReplace = this.onReplace.bind( this );
	}

	onReplace( blocks ) {
		const { attributes, onReplace } = this.props;
		onReplace( blocks.map( ( block, index ) => (
			index === 0 && block.name === name ?
				{ ...block,
					attributes: {
						...attributes,
						...block.attributes,
					},
				} :
				block
		) ) );
	}

	render() {
		const {
			attributes,
			setAttributes,
			mergeBlocks,
			onReplace,
			className,
			overlayColor,
			setOverlayColor,
			fallbackOverlayColor,
		} = this.props;

		const {
			content,
			placeholder,
      url, title, align, contentAlign, id, hasParallax, dimRatio
		} = attributes;

    const updateAlignment = ( nextAlign ) => setAttributes( { align: nextAlign } );
    const onSelectImage = ( media ) => setAttributes( { url: media.url, id: media.id } );
    const toggleParallax = () => setAttributes( { hasParallax: ! hasParallax } );
		const setDimRatio = ( ratio ) => setAttributes( { dimRatio: ratio } );

		function dimRatioToClass( dimRatio ) {
			return ( dimRatio === 0 || dimRatio === 59 ) ?
				null :
				'has-background-dim-' + ( 10 * Math.round( dimRatio / 10 ) );
		}

		function backgroundImageStyles( url ) {
			return url ?
				{ backgroundImage: `url(${ url })` } :
				undefined;
		}

		const classes = classnames(
			'wp-block-cover-image',
			contentAlign !== 'center' && `has-${ contentAlign }-content`,
			dimRatioToClass( dimRatio ),
			{
				'has-background-dim': dimRatio !== 0,
				'has-parallax': hasParallax,
				[ overlayColor.class ]: overlayColor.class
			},
			align ? `align${ align }` : null,
		);

		const styles = ( {
			//backgroundColor: overlayColor.value,
			backgroundImage:`url(${ url })`,
		} );

		const hasTitle =  title;
		const icon = title ? undefined : 'format-image';

		const controls = (
			<Fragment>
				<BlockControls>
					<BlockAlignmentToolbar
						value={ align }
						onChange={ updateAlignment }
					/>
					<AlignmentToolbar
						value={ contentAlign }
						onChange={ ( nextAlign ) => {
							setAttributes( { contentAlign: nextAlign } );
						} }
					/>
					<Toolbar>
						<MediaUpload
							onSelect={ onSelectImage }
							type="image"
							value={ id }
							render={ ( { open } ) => (
								<IconButton
									className="components-toolbar__control"
									label={ __( 'Edit image' ) }
									icon="edit"
									onClick={ open }
								/>
							) }
						/>
					</Toolbar>
				</BlockControls>
			</Fragment>
		);


		// If no image has been selected
		if ( ! url ) {
			return (
				<Fragment>
					{ controls }
					<MediaPlaceholder
						icon={ icon }
						className={ className }
						labels={ {
							title: __( 'Choose a Background Image' ),
							name: __( 'an image' ),
						} }
						onSelect={ onSelectImage }
						accept="image/*"
						type="image"
					/>
				</Fragment>
			);
		}

		// normal Image Selection
		return (
			<Fragment>
      <BlockControls>
        <BlockAlignmentToolbar
          value={ align }
          onChange={ updateAlignment }
        />
        <AlignmentToolbar
          value={ contentAlign }
          onChange={ ( nextAlign ) => {
            setAttributes( { contentAlign: nextAlign } );
          } }
        />
        <Toolbar>
          <MediaUpload
            onSelect={ onSelectImage }
            type="image"
            value={ id }
            render={ ( { open } ) => (
              <IconButton
                className="components-toolbar__control"
                label={ __( 'Edit image' ) }
                icon="edit"
                onClick={ open }
              />
            ) }
          />
        </Toolbar>
      </BlockControls>
				<InspectorControls>
					<PanelColorSettings
						title={ __( 'Image Overlay Color' ) }
						initialOpen={ false }
						colorSettings={ [
							{
								value: overlayColor.color,
								onChange: setOverlayColor,
								label: __( 'Overlay Color' ),
							},
						] }
					>
					</PanelColorSettings>

            { !! url && (
    						<PanelBody title={ __( 'Cover Image Settings' ) }>
    							<ToggleControl
    								label={ __( 'Fixed Background' ) }
    								checked={ !! hasParallax }
    								onChange={ toggleParallax }
    							/>
    							<RangeControl
										label={ __( 'Background Dimness' ) }
										value={ dimRatio }
										onChange={ setDimRatio }
										min={ 60 }
										max={ 100 }
										step={ 10 }
    							/>
    						</PanelBody>

    				) }
				</InspectorControls>

        <div
	        data-url={ url }
					className={ classes }
					style={ styles }
        >

					<InnerBlocks
	          layouts={ [
	            { name: 'inner', label: 'Inner Content', icon: 'columns' },
	          ] }
	        />
				</div>
			</Fragment>
		);
	}
}

export default registerBlockType('hms/cover-img', {
	title: __( 'Inner Blocks Cover Image', 'hmsblocks' ),
	icon: 'format-image',
	category: 'common',
  attributes: {
    overlayColor: {
      type: 'string',
      default: 'none',
    },
    title: {
      type: 'array',
      source: 'children',
      selector: 'p',
    },
    url: {
      type: 'string',
    },
    align: {
      type: 'string',
    },
    contentAlign: {
      type: 'string',
    },
    id: {
      type: 'number',
    },
    hasParallax: {
      type: 'boolean',
      default: false,
    },
    dimRatio: {
      type: 'number',
      default: 60,
    },
  },
	edit: compose( [
		withColors('overlayColor'),
		applyFallbackStyles,
	] )(InnerBlocksCoverIMG),

	getEditWrapperProps( attributes ) {
		const { align } = attributes;
		if ( -1 !== validAlignments.indexOf( align ) ) {
			return { 'data-align': align };
		}
	},

	save( { attributes, className } ) {

		const {
			overlayColor,
			customOverlayColor,
			url, hasParallax, dimRatio, align, contentAlign
		}= attributes;

		const overlayClass = getColorClassName( 'overlay-color', overlayColor );
		const style = backgroundImageStyles( url );

		const classes = classnames(
			'wp-block-cover-image',
			contentAlign ? `has-${ contentAlign }-content` : null,
			dimRatioToClass( dimRatio ),
			{
				'has-background-dim': dimRatio !== 0,
				'has-parallax': hasParallax,
				[ overlayClass ]: overlayClass,
			},
			align ? `align${ align }` : null,
		);

		return (
			<div className={ classes } style={ style }>
				<InnerBlocks.Content/>
			</div>
		);
	},
});

function dimRatioToClass( ratio ) {
	return ( ratio === 0 || ratio === 50 ) ?
		null :
		'has-background-dim-' + ( 10 * Math.round( ratio / 10 ) );
}

function backgroundImageStyles( url ) {
	return url ?
		{ backgroundImage: `url(${ url })` } :
		undefined;
}
