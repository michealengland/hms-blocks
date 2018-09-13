import classnames from 'classnames';

const { __, } = wp.i18n;

const {
	registerBlockType,
} = wp.blocks;
const {
	ContrastChecker,
	InspectorControls,
	InnerBlocks,
	PanelColor,
	withColors,
	getColorClass,
	BlockControls, BlockAlignmentToolbar, AlignmentToolbar,
} = wp.editor;
const {
	PanelBody,
	withFallbackStyles,
	ColorPalette,
	Toolbar,
} = wp.components;

const {
	Component,
	Fragment,
} = wp.element;

const { compose } = wp.compose;

import './style.scss';


const {getComputedStyle} = window;

const FallbackStyles = withFallbackStyles((node, ownProps) => {
	const {textColor, backgroundColor} = ownProps.attributes;
	const editableNode = node.querySelector('[contenteditable="true"]');
	//verify if editableNode is available, before using getComputedStyle.
	const computedStyles = editableNode ? getComputedStyle(editableNode) : null;
	return {
		fallbackBackgroundColor: backgroundColor || ! computedStyles ? undefined : computedStyles.backgroundColor,
		fallbackTextColor: textColor || ! computedStyles ? undefined : computedStyles.color,
	};
});


// Block Alignement
const validAlignments = [ 'left', 'center', 'right', 'wide', 'full' ];

function getEditWrapperProps( attributes ) {
	const { align } = attributes;
	if ( -1 !== validAlignments.indexOf( align ) ) {
		return { 'data-align': align };
	}
}


class NestedTemplateCTA extends Component {
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
			fallbackFontSize,
		} = this.props;

		const {
			align,
			contentAlign,
			content,
			dropCap,
			placeholder,
		} = attributes;

		const updateAlignment = ( nextAlign ) => setAttributes( { align: nextAlign } );
		const updateContentAlignment = ( nextContentAlign ) => setAttributes( { contentAlign: nextContentAlign } );

		const classes = classnames(
			className,
			//contentAlign !== 'center' && `has-${ contentAlign }-content`,
			contentAlign ? `has-${ contentAlign }-content` : null,
			{
				'has-background': backgroundColor || customBackgroundColor,
				[ textColor.class ]: textColor.class,
				[ backgroundColor.class ]: backgroundColor.class,
			},
			align ? `align${ align }` : null,
		);

		const styles = ( {
			backgroundColor: backgroundColor.value,
			textColor: textColor.value,
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
						<PanelColor
							{...{
								title: 'Background Color',
								colorName: backgroundColor.name,
								colorValue: backgroundColor.value,
								initialOpen: false,
								onChange: setBackgroundColor,
							} }
						/>

						<PanelColor
							{...{
								title: 'Text Color',
								colorName: textColor.name,
								colorValue: textColor.value,
								initialOpen: false,
								onChange: setTextColor,
							} }
						/>

						<ContrastChecker
							textColor={ textColor.value }
							backgroundColor={ backgroundColor.value }
							{ ...{
								fallbackBackgroundColor,
								fallbackTextColor,
							} }
						/>

			</InspectorControls>
			<div
				className={ classes }
				style={ styles }
			 >
				<InnerBlocks

          layouts={ [
            { name: 'inner', label: 'Inner Blocks CTA', icon: 'columns' },
          ] }

          template={
            [
              [ 'core/heading', { layout:'inner', placeholder:'CTA Title...' } ],
              [ 'core/paragraph', { layout:'inner', placeholder:'Write something interesting...' } ],
              [ 'core/button', { layout:'inner' } ],
            ]
          }
        />
			</div>
			</Fragment>
		);
	}
}

export default registerBlockType('hms/innerblocks-cta', {
	title: __( 'Inner Blocks CTA', 'hmsblocks' ),
	icon: 'yes',
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
		withColors('backgroundColor', {textColor: 'color'}),
		FallbackStyles,
	] )(NestedTemplateCTA),
	save: props => {
		const {
			align,
			contentAlign,
			backgroundColor,
			textColor,
			customBackgroundColor,
			customTextColor,
		} = props.attributes;


		//const updateAlignment = ( nextAlign ) => setAttributes( { align: nextAlign } );
		const textClass = getColorClass( 'color', textColor );
		const backgroundClass = getColorClass( 'background-color', backgroundColor );

		const className = classnames(
			//contentAlign !== 'center' && `has-${ contentAlign }-content`,
			contentAlign ? `has-${ contentAlign }-content` : null,
			{
				'has-background': backgroundColor || customBackgroundColor,
				[ textClass ]: textClass,
				[ backgroundClass ]: backgroundClass,
			},
			align ? `align${ align }` : null,
		);
		return (
			<div className={className}>
				<InnerBlocks.Content/>
			</div>
		);
	},
});
