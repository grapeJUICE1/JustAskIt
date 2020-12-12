import React, { Component, Fragment } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import SortButtons from '../../components/SortButtons/SortButtons';
import Post from '../../components/Post/Post';
import { connect } from 'react-redux';
import styles from './Posts.module.scss';

import * as actions from '../../store/actions/index';
import Loader from '../../components/UI/Loader/Loader';
import checkAuth from '../../hoc/checkAuth';

class Posts extends Component {
  PER_PAGE = 10;
  state = {
    currentPage:
      typeof window.localStorage !== 'undefined'
        ? localStorage.getItem('currentPage') || 1
        : 1,
    total: 0,
    totalPages: 0,
    sortBy: '-createdAt',
    filter: {},
  };

  componentDidMount() {
    this.props.onFetchPosts(
      this.state.sortBy,
      this.state.filter,
      this.state.currentPage,
      this.PER_PAGE
    );
  }
  componentDidUpdate(_, prevState) {
    if (
      prevState.sortBy !== this.state.sortBy ||
      prevState.filter !== this.state.filter ||
      prevState.currentPage !== this.state.currentPage
    ) {
      localStorage.setItem('currentPage', this.state.currentPage);
      this.props.onFetchPosts(
        this.state.sortBy,
        this.state.filter,
        this.state.currentPage,
        this.PER_PAGE
      );
    }
  }

  setDefaultCurrentPage = () => {
    this.setState({ currentPage: 0 });
    localStorage.setItem('currentPage', 0);
  };
  handlePageClick = ({ selected }) => {
    this.setState({ currentPage: selected + 1 });
  };
  removeFilter = (e) => {
    this.setState({ filter: {} });
  };
  sortByViews = (e) => {
    this.setState({ sortBy: '-views' });
    this.setDefaultCurrentPage();
  };
  sortByVotes = (e) => {
    this.setState({ sortBy: '-voteCount' });
    this.setDefaultCurrentPage();
  };
  sortNewest = (e) => {
    this.setState({ sortBy: '-createdAt' });
    this.setDefaultCurrentPage();
  };
  sortOldest = (e) => {
    this.setState({ sortBy: 'createdAt' });
    this.setDefaultCurrentPage();
  };
  filterUnanswered = (e) => {
    this.setDefaultCurrentPage();
    this.setState({ sortBy: '-createdAt' });
    this.setState({ filter: { answerCount: 0 } });
  };
  filterByTag = (tag) => {
    this.setDefaultCurrentPage();
    this.setState({ sortBy: '-createdAt' });
    this.setState({ filter: { tags: tag } });
  };

  render() {
    const pageCount = Math.ceil(this.props.totalPages / this.PER_PAGE);

    let posts;
    let title;
    let sortButtons = (
      <SortButtons
        removeFilter={this.removeFilter}
        sortNewest={this.sortNewest}
        sortOldest={this.sortOldest}
        sortByViews={this.sortByViews}
        sortByVotes={this.sortByVotes}
        filterUnanswered={this.filterUnanswered}
      />
    );
    if (this.state.filter.tags) {
      title = (
        <h2 className="mt-4">
          Questions tagged with: [{this.state.filter.tags}]
        </h2>
      );
    } else if (this.state.filter.answerCount === 0) {
      title = <h2 className="mt-4">Unanswered Questions</h2>;
    } else {
      title = <h2 className="mt-4">All Questions</h2>;
    }
    if (this.props.error) {
      posts = <h1 className="text-center py-5">{this.props.error.message}</h1>;
    } else if (this.props.loading) {
      posts = <Loader />;
    } else {
      posts = (
        <Fragment>
          <Row className="ratio">
            <Col lg={9} className="App mt-4  ml-0 ">
              {this.props.posts.map((post) => {
                return (
                  <Post
                    key={post.id}
                    post={post}
                    onFilterTag={(tag) => this.filterByTag(tag)}
                  />
                );
              })}
            </Col>
          </Row>
          <ReactPaginate
            previousLabel={'<<'}
            nextLabel={'>>'}
            initialPage={
              localStorage.getItem('currentPage') - 1 >= 0
                ? localStorage.getItem('currentPage') - 1
                : 0
            }
            pageCount={pageCount}
            onPageChange={this.handlePageClick}
            containerClassName={`${styles.pagination} pb-5 text-center ml-lg-4`}
            previousLinkClassName={`${styles.pagination__link}`}
            nextLinkClassName={`${styles.pagination__link}`}
            disabledClassName={`${styles.pagination__link__disabled}`}
            activeClassName={`${styles.pagination__link__active}`}
          />
        </Fragment>
      );
    }

    return (
      <Container className="d-flex flex-column justify-content-between ml-lg-4 pt-5 mt-5">
        {!this.props.error && (
          <Row>
            <Col lg={5} className="l">
              {title}
              <h3 className="mt-4">{this.props.totalPages} questions</h3>
            </Col>
            {sortButtons}
          </Row>
        )}
        {posts}
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    total: state.posts.total,
    totalPages: state.posts.totalPages,
    posts: state.posts.posts,
    error: state.posts.error,
    loading: state.posts.loading,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onFetchPosts: (sortBy, filter, currentPage, perPagePosts) =>
      dispatch(actions.fetchPosts(sortBy, filter, currentPage, perPagePosts)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(checkAuth(Posts));
