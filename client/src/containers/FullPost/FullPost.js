import React, { Component, Fragment } from 'react';
import { Container } from 'react-bootstrap';
import { connect } from 'react-redux';

import Question from './Question/Question';
import { withRouter } from 'react-router';
import Answers from './Answers/Answers';
import * as actions from '../../store/actions/index';
import Loader from '../../components/UI/Loader/Loader';
import checkAuth from '../../hoc/checkAuth';

class FullPost extends Component {
  state = {
    post: {},
  };
  componentDidMount() {
    this.props.onFetchFullPost(this.props.match.params.id);
  }

  render() {
    let post;
    if (this.props.error) {
      // post = <h1>{this.props.error.message}</h1>;
      if (this.props.post.id) {
        post = <Question post={this.props.post} />;
      } else {
        post = <h1>{this.props.error.message}</h1>;
      }
    } else if (this.props.loading) {
      post = <Loader />;
    } else {
      post = <Question post={this.props.post} />;
    }
    return (
      <Fragment>
        <Container className="d-flex flex-column justify-content-between pt-5 mt-5 mr-lg-4">
          {post}
          <Answers postId={this.props.match.params.id} />
        </Container>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    post: state.fullPost.post,
    error: state.fullPost.error,
    loading: state.fullPost.loading,
    user: state.auth.user,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onFetchFullPost: (id) => dispatch(actions.fetchFullPost(id)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(checkAuth(FullPost)));
