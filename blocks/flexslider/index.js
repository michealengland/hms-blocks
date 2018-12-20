/**
 * External dependencies
 */
import filter from 'lodash/filter';
import every from 'lodash/every';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { RichText, mediaUpload } = wp.editor;
const { createBlobURL } = wp.blob;

/**
 * Internal dependencies
 */
import { default as edit } from './edit';

import './style.scss';
import './editor.scss';

const blockAttributes = {
	images: {
		type: 'array',
		default: [],
		source: 'query',
		selector: '.flexslider ul .slide',
		render_callback: 'hms_fs_js_render_callback',
		query: {
			url: {
				source: 'attribute',
				selector: 'img',
				attribute: 'src',
			},
			link: {
				source: 'attribute',
				selector: 'img',
				attribute: 'data-link',
			},
			alt: {
				source: 'attribute',
				selector: 'img',
				attribute: 'alt',
				default: '',
			},
			id: {
				source: 'attribute',
				selector: 'img',
				attribute: 'data-id',
			},
			caption: {
				type: 'array',
				source: 'children',
				selector: 'figcaption',
			},
		},
	},
	imageCrop: {
		type: 'boolean',
		default: true,
	},
	linkTo: {
		type: 'string',
		default: 'none',
	},
};

export default registerBlockType(
	'hms/fs',
	{
	title: __( 'HMS Flex Slider' ),
	description: __( 'Create a simple slider.' ),
	icon: 'images-alt',
	category: 'common',
	keywords: [ __( 'slider' ) ],
	attributes: blockAttributes,
	supports: {
		align: true,
	},

	edit,

	save( { attributes } ) {
		const { images, imageCrop, linkTo } = attributes;
		return (
			<div className="flexslider">
				<ul className="slides">
					{ images.map( ( image ) => {
						let href;

						switch ( linkTo ) {
							case 'media':
								href = image.url;
								break;
							case 'attachment':
								href = image.link;
								break;
						}

						const img = <img src={ image.url } alt={ image.alt } data-id={ image.id } data-link={ image.link } className={ image.id ? `wp-image-${ image.id }` : null } />;

						return (
							<li key={ image.id || image.url } className="slide">
								<figure>
									{ href ? <a href={ href }>{ img }</a> : img }
									{ image.caption && image.caption.length > 0 && (
										<RichText.Content tagName="figcaption" value={ image.caption } />
									) }
								</figure>
							</li>
						);
					} ) }
				</ul>
			</div>

		);
	},
} );
