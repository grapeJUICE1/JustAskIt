import React, { Component, Fragment } from 'react';
import { Container, Button } from 'react-bootstrap';
import { connect } from 'react-redux';

import Question from './Question/Question';
import { withRouter } from 'react-router';
import Answers from './Answers/Answers';
import * as actions from '../../store/actions/index';
import Loader from '../../components/UI/Loader/Loader';
import checkAuth from '../../hoc/checkAuth';
import SubmitPostAnswer from '../../components/SubmitModals/SubmitPostAnswer/SubmitPostAnswer';

class FullPost extends Component {
  state = {
    post: {},
    show: false,
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
          <div></div>
          {!this.props.error && (
            <>
              <Answers postId={this.props.match.params.id} />

              <br />
              <br />
            </>
          )}
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

    submitError: state.fullPost.submitError,
    submitLoading: state.fullPost.submitLoading,
    user: state.auth.user,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onFetchFullPost: (id) => dispatch(actions.fetchFullPost(id)),
    onResetEditSuccess: () => dispatch(actions.resetEditSuccess()),
    onSubmitPost: (
      title,
      content,
      userId,
      tags,
      contentWordCount,
      type,
      postId
    ) =>
      dispatch(
        actions.submitPost(
          title,
          content,
          userId,
          tags,
          contentWordCount,
          type,
          postId
        )
      ),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(checkAuth(FullPost)));
