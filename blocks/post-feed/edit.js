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
const { withSelect } = wp.data;

const MAX_POSTS_COLUMNS = 6;

class CustomPostsFeedEdit extends Component {
	constructor() {
		super( ...arguments );

        this.toggleDisplayPostThumbnail = this.toggleDisplayPostThumbnail.bind( this );
        this.toggleDisplayPostDate = this.toggleDisplayPostDate.bind( this );
    }
    
    toggleDisplayPostThumbnail() {
		const { displayPostThumbnail } = this.props.attributes;
		const { setAttributes } = this.props;

		setAttributes( { displayPostThumbnail: ! displayPostThumbnail } );
	}

	toggleDisplayPostDate() {
		const { displayPostDate } = this.props.attributes;
		const { setAttributes } = this.props;

		setAttributes( { displayPostDate: ! displayPostDate } );
    }
    

	render() {
		const { attributes, categoriesList, setAttributes, latestPosts } = this.props;
		const { displayPostThumbnail, displayPostDate, align, postLayout, columns, order, orderBy, categories, postsToShow, url } = attributes;

		const inspectorControls = (
			<InspectorControls>
				<PanelBody title={ __( 'Latest Posts Settings' ) }>
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
						label={ __( 'Display Post Thumbnail' ) }
						checked={ displayPostThumbnail }
						onChange={ this.toggleDisplayPostThumbnail }
					/>

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
						<li key={ i }>
						
						{
						/*
							displayPostThumbnail && post.featured_image_src !== undefined && post.featured_image_src ? (
								<div class="featured-img">
									<img
										src={ post.featured_image_src }
										alt={ decodeEntities( post.title.rendered.trim() ) || __( '(Untitled)' ) }
									/>
								</div>
							) : (
								null
							)
						*/
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
		categories,
		order,
		orderby: orderBy,
		per_page: postsToShow,
	}, ( value ) => ! isUndefined( value ) );
	const categoriesListQuery = {
		per_page: 100,
	};

	console.log(latestPostsQuery);

	return {
		latestPosts: getEntityRecords( 'postType', 'post', latestPostsQuery ),
		categoriesList: getEntityRecords( 'taxonomy', 'category', categoriesListQuery ),
	};
} )( CustomPostsFeedEdit );
