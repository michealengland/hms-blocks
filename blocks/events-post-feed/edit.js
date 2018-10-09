/**
 * External dependencies
 */
import isUndefined from 'lodash/isUndefined';
import pickBy from 'lodash/pickBy';
import moment from 'moment';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const { Component, Fragment } = wp.element;
const {
	PanelBody,
	Placeholder,
	QueryControls,
	RangeControl,
	Spinner,
	SelectControl,
	ToggleControl,
	Toolbar,
} = wp.components;
const  { __ } = wp.i18n;
const { decodeEntities } = wp.htmlEntities;
const {
	InspectorControls,
	BlockAlignmentToolbar,
	BlockControls,
} = wp.editor;
const {
	withSelect,
} = wp.data;

const MAX_POSTS_COLUMNS = 6;

class EventsPostsFeedEdit extends Component {
	constructor() {
		super( ...arguments );
		this.toggleDisplayPostDate = this.toggleDisplayPostDate.bind( this );
		this.toggleDisplayPostImage = this.toggleDisplayPostImage.bind( this );
	}

	toggleDisplayPostDate() {
		const { displayPostDate } = this.props.attributes;
		const { setAttributes } = this.props;

		setAttributes( { displayPostDate: ! displayPostDate } );
	}
	
	toggleDisplayPostImage() {
		const { displayPostImage } = this.props.attributes;
		const { setAttributes } = this.props;

		setAttributes( { displayPostImage: ! displayPostImage } );
	}
    
	render() {
		const { attributes, categoriesList, setAttributes, latestPosts } = this.props;
		const { displayPostDate, displayPostImage, imageCrop, align, postLayout, columns, order, orderBy, categories, postsToShow, startDate } = attributes;

		// Thumbnail options
		const imageCropOptions = [
			{ value: 'landscape', label: __( 'Landscape' ) },
			{ value: 'square', label: __( 'Square' ) },
		];

		const isLandscape = imageCrop === 'landscape';

		const inspectorControls = (
			<InspectorControls>
				<PanelBody title={ __( 'Event Post Settings' ) }>
					<QueryControls
						{ ...{ order, orderBy } }
						numberOfItems={ postsToShow }
						categoriesList={ categoriesList }
						selectedCategoryId={ categories }
						onOrderChange={ ( value ) => setAttributes( { order: value } ) }
						onOrderByChange={ ( value ) => setAttributes( { orderBy: value } ) }
						onCategoryChange={ ( value ) => setAttributes( { categories: '' !== value ? value : undefined } ) }
						onNumberOfItemsChange={ ( value ) => setAttributes( { postsToShow: value } ) }
					/>

					<ToggleControl
						label={ __( 'Display Featured Image' ) }
						checked={ displayPostImage }
						onChange={ this.toggleDisplayPostImage }
					/>

					{ displayPostImage &&
						<SelectControl
							label={ __( 'Featured Image Style' ) }
							options={ imageCropOptions }
							value={ imageCrop }
							onChange={ ( value ) => this.props.setAttributes( { imageCrop: value } ) }
						/>
					}

					<ToggleControl
						label={ __( 'Display post date' ) }
						checked={ displayPostDate }
						onChange={ this.toggleDisplayPostDate }
					/>

					{ postLayout === 'grid' &&
						<RangeControl
							label={ __( 'Columns' ) }
							value={ columns }
							onChange={ ( value ) => setAttributes( { columns: value } ) }
							min={ 2 }
							max={ ! hasPosts ? MAX_POSTS_COLUMNS : Math.min( MAX_POSTS_COLUMNS, latestPosts.length ) }
						/>
					}
				</PanelBody>
			</InspectorControls>
		);

		const hasPosts = Array.isArray( latestPosts ) && latestPosts.length;
		if ( ! hasPosts ) {
			return (
				<Fragment>
					{ inspectorControls }
					<Placeholder
						icon="admin-post"
						label={ __( 'Latest Posts' ) }
					>
						{ ! Array.isArray( latestPosts ) ?
							<Spinner /> :
							__( 'No posts found.' )
						}
					</Placeholder>
				</Fragment>
			);
		}

		// Removing posts from display should be instant.
		const displayPosts = latestPosts.length > postsToShow ?
			latestPosts.slice( 0, postsToShow ) :
			latestPosts;

		const layoutControls = [
			{
				icon: 'list-view',
				title: __( 'List View' ),
				onClick: () => setAttributes( { postLayout: 'list' } ),
				isActive: postLayout === 'list',
			},
			{
				icon: 'grid-view',
				title: __( 'Grid View' ),
				onClick: () => setAttributes( { postLayout: 'grid' } ),
				isActive: postLayout === 'grid',
			},
		];
		

		return (
			<Fragment>
				{ inspectorControls }
				<BlockControls>
					<BlockAlignmentToolbar
						value={ align }
						onChange={ ( nextAlign ) => {
							setAttributes( { align: nextAlign } );
						} }
						controls={ [ 'center', 'wide', 'full' ] }
					/>
					<Toolbar controls={ layoutControls } />
				</BlockControls>

				<ul
				className={ classnames( this.props.className, {
					'is-grid': postLayout === 'grid',
					[ `columns-${ columns }` ]: postLayout === 'grid',
				} ) }
				>
					{ displayPosts.map( ( post, i ) =>
						
						<li
						key={ i }
						className={ classnames(
							post.featured_image_src && displayPostImage ? 'has-featured': ''
						) }
						>

						{ console.log( startDate )}

						{
							displayPostImage && post.featured_image_src !== undefined && post.featured_image_src ? (
							<div class="hms-block-post-grid-image">
		
									<img
										src={ isLandscape ? post.featured_image_src : post.featured_image_src_square }
										alt={ decodeEntities( post.title.rendered.trim() ) || __( '(Untitled)' ) }
									/>
							
							</div>
							 				
							) : (
								null
							)
						}
							<a href={ post.link } target="_blank">{ decodeEntities( post.title.rendered.trim() ) || __( '(Untitled)' ) }</a>
							{ displayPostDate && post.date_gmt &&
								<time dateTime={ moment( post.date_gmt ).utc().format() } className={ `${ this.props.className }__post-date` }>
									{ moment( post.date_gmt ).local().format( 'MMMM DD, Y' ) }
								</time>
							}
						</li>
					) }
				</ul>
			</Fragment>
		);
	}
}

export default withSelect( ( select, props ) => {
	const { postsToShow, order, orderBy, categories } = props.attributes;
	const { getEntityRecords } = select( 'core' );
	const latestPostsQuery = pickBy( {
		hms_event_types: categories, // Changes rest base to hms_event_types taxonomy and selects term by Id
		order,
		orderby: orderBy,
		query: true,
		per_page: postsToShow,
	},
	( value ) => ! isUndefined( value ) );
	const categoriesListQuery = {
		per_page: 100,
		showPostsCount: true,
	}
	return {
		// Enables post type on displayed posts.		
		latestPosts: getEntityRecords( 'postType', 'hms_events_cpt_1',latestPostsQuery ),
		// Adds hms_event_types dropdown selector list.
		categoriesList: getEntityRecords( 'taxonomy','hms_event_types', categoriesListQuery ),
	};

} )( EventsPostsFeedEdit );
