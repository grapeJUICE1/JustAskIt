import React, { Component } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import SortButtons from '../../components/SortButtons/SortButtons';
import Post from '../../components/Post/Post';
import axios from 'axios';
import { connect } from 'react-redux';

import * as actions from '../../store/actions/index';

class Posts extends Component {
  PER_PAGE = 10;
  state = {
    currentPage: 1,
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
      this.props.onFetchPosts(
        this.state.sortBy,
        this.state.filter,
        this.state.currentPage,
        this.PER_PAGE
      );
    }
  }
  async fetchData() {
    try {
      const res = await axios.get('http://localhost:7000/api/v1/posts', {
        params: {
          sort: this.state.sortBy,
          limit: this.PER_PAGE,
          page: this.state.currentPage,
          ...this.filter,
        },
      });
      this.setState({ total: res.data.results });
      this.setState({ totalPages: res.data.totalNumOfData });
      this.setState({ posts: res.data.data.docs });
    } catch (err) {
      this.setState({ error: err });
    }
  }

  handlePageClick = ({ selected }) => {
    this.setState({ currentPage: selected + 1 });
  };

  sortByViews = (e) => {
    this.setState({ filter: {} });
    this.setState({ sortBy: '-views' });
  };
  sortByVotes = (e) => {
    this.setState({ filter: {} });
    this.setState({ sortBy: '-voteCount' });
  };
  sortNewest = (e) => {
    this.setState({ filter: {} });
    this.setState({ sortBy: '-createdAt' });
  };
  sortOldest = (e) => {
    this.setState({ filter: {} });
    this.setState({ sortBy: 'createdAt' });
  };
  filterUnanswered = (e) => {
    this.setState({ currentPage: 0 });
    this.setState({ sortBy: '-createdAt' });
    this.setState({ filter: { ...this.state.filter, answerCount: 0 } });
  };

  render() {
    const pageCount = Math.ceil(
      (Object.keys(this.state.filter).length === 0
        ? this.props.totalPages
        : this.props.total) / this.PER_PAGE
    );
    return (
      <Container className="d-flex flex-column justify-content-between ml-lg-4 pt-5 mt-5">
        {!this.props.error && (
          <Row>
            <Col lg={5} className="l">
              <h2 className="mt-4">All Questions</h2>
              <h3 className="mt-4">{this.props.totalPages} questions</h3>
            </Col>
            <SortButtons
              sortNewest={this.sortNewest}
              sortOldest={this.sortOldest}
              sortByViews={this.sortByViews}
              sortByVotes={this.sortByVotes}
              filterUnanswered={this.filterUnanswered}
            />
          </Row>
        )}
        {(this.props.posts.length === 0 || this.props.posts === undefined) &&
          !this.props.error && (
            <Spinner
              animation="border"
              role="status"
              className="spinner-round mx-auto my-5"
            >
              <span className="sr-only">Loading...</span>
            </Spinner>
          )}
        {this.props.error && (
          <h1 className="text-center py-5">{this.state.error.message}</h1>
        )}
        <Row className="ratio">
          <Col lg={9} className="App mt-4  ml-0 ">
            {this.props.posts.map((post) => {
              return <Post key={post.id} post={post} />;
            })}
          </Col>
        </Row>
        <ReactPaginate
          previousLabel={'<<'}
          nextLabel={'>>'}
          pageCount={pageCount}
          onPageChange={this.handlePageClick}
          containerClassName={'pagination pb-5'}
          previousLinkClassName={'pagination__link'}
          nextLinkClassName={'pagination__link'}
          disabledClassName={'pagination__link--disabled'}
          activeClassName={'pagination__link--active'}
        />
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
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onFetchPosts: (sortBy, filter, currentPage, perPagePosts) =>
      dispatch(actions.fetchPosts(sortBy, filter, currentPage, perPagePosts)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Posts);
