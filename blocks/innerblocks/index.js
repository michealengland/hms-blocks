import classnames from 'classnames';

const { __, } = wp.i18n;

const {
	Component,
	Fragment,
} = wp.element;

const {
	registerBlockType,
} = wp.blocks;

const {
	withColors,
	AlignmentToolbar,
	BlockAlignmentToolbar,
	BlockControls,
	ContrastChecker,
	InspectorControls,
	PanelColorSettings,
	InnerBlocks,
	getColorClassName,
} = wp.editor;

const {
	withFallbackStyles,
} = wp.components;

const { compose } = wp.compose;

import './style.scss';
import './editor.scss';

const {getComputedStyle} = window;

const applyFallbackStyles = withFallbackStyles( ( node, ownProps ) => {
	const { textColor, backgroundColor } = ownProps.attributes;
	const editableNode = node.querySelector( '[contenteditable="true"]' );
	//verify if editableNode is available, before using getComputedStyle.
	const computedStyles = editableNode ? getComputedStyle( editableNode ) : null;
	return {
		fallbackBackgroundColor: backgroundColor || ! computedStyles ? undefined : computedStyles.backgroundColor,
		fallbackTextColor: textColor || ! computedStyles ? undefined : computedStyles.color,
	};
} );

// Block Alignement
const validAlignments = [ 'left', 'center', 'right', 'wide', 'full' ];
const updateAlignment = ( nextAlign ) => setAttributes( { align: nextAlign } );

class HMSInnerBlocks extends Component {
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
			backgroundColor,
			textColor,
			setBackgroundColor,
			setTextColor,
			fallbackBackgroundColor,
			fallbackTextColor,
		} = this.props;

		const {
			align,
			contentAlign,
		} = attributes;

		const updateAlignment = ( nextAlign ) => setAttributes( { align: nextAlign } );
		const updateContentAlignment = ( nextContentAlign ) => setAttributes( { contentAlign: nextContentAlign } );

		const classes = classnames(
			className,
			'wp-block-column',
			contentAlign ? `has-${ contentAlign }-content` : null,
			{
				'has-background': backgroundColor.color,
				[ backgroundColor.class ]: backgroundColor.class,
				[ textColor.class ]: textColor.class,
			},
			align ? `align${ align }` : null,
		);

		const styles = ( {
			backgroundColor: backgroundColor.color,
			color: textColor.color,
			textAlign: contentAlign,
		} );

		return (
			<Fragment>
				<BlockControls>
					<BlockAlignmentToolbar
						value={ align }
						onChange={ updateAlignment }
					/>
					<AlignmentToolbar
						value={ contentAlign }
						onChange={ updateContentAlignment }
					/>
				</BlockControls>
				<InspectorControls>			
					<PanelColorSettings
						title={ __( 'Color Settings' ) }
						initialOpen={ false }
						colorSettings={ [
							{
								value: backgroundColor.color,
								onChange: setBackgroundColor,
								label: __( 'Background Color' ),
							},
							{
								value: textColor.color,
								onChange: setTextColor,
								label: __( 'Text Color' ),
							},
						] }
					>
						<ContrastChecker
							{ ...{
								textColor: textColor.color,
								backgroundColor: backgroundColor.color,
								fallbackTextColor,
								fallbackBackgroundColor,
							} }
						/>
					</PanelColorSettings>
				</InspectorControls>
				<div
				className={ classes }
				style={ styles }
				>
				<InnerBlocks
				layouts={ [
					{ name: 'inner', label: 'Inner Blocks CTA', icon: 'columns' },
				] }
				/>
				</div>
			</Fragment>
		);
	}
}

export default registerBlockType('hms/innerblocks', {
	title: __( 'Inner Blocks', 'hmsblocks' ),
	icon: 'admin-appearance',
	category: 'common',
	attributes: {
		align: {
			type: 'string',
		},
		contentAlign: {
			type: 'string',
		},
		textColor: {
			type: 'string',
		},
		customTextColor: {
			type: 'string',
		},
		backgroundColor: {
			type: 'string',
		},
		customBackgroundColor: {
			type: 'string',
		},
	},
	edit: compose( [
		withColors( 'backgroundColor', { textColor: 'color' } ),
		applyFallbackStyles,
	] )(HMSInnerBlocks),

	getEditWrapperProps( attributes ) {
		const { align } = attributes;
		if ( -1 !== validAlignments.indexOf( align ) ) {
			return { 'data-align': align };
		}
	},

	save: props => {
		const {
			align,
			contentAlign,
			backgroundColor,
			textColor,
			customBackgroundColor,
			customTextColor,
		} = props.attributes;


		const updateAlignment = ( nextAlign ) => setAttributes( { align: nextAlign } );

		const textClass = getColorClassName( 'color', textColor );
		const backgroundClass = getColorClassName( 'background-color', backgroundColor );

		const className = classnames(
			//contentAlign !== 'center' && `has-${ contentAlign }-content`,
			className,
			contentAlign ? `has-${ contentAlign }-content` : null,
			{
				'has-background': backgroundColor || customBackgroundColor,
				[ textClass ]: textClass,
				[ backgroundClass ]: backgroundClass,
			},
			align ? `align${ align }` : null,
		);

		const styles = {
			backgroundColor: backgroundClass ? undefined : customBackgroundColor,
			color: textClass ? undefined : customTextColor,
		};

		return (
			<div className={className} style={ styles }>
				<InnerBlocks.Content/>
			</div>
		);
	},
});
