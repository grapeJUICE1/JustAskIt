import React, { Component, Fragment } from 'react';
import Question from './Question/Question';
import { withRouter } from 'react-router';
import Answers from './Answers/Answers';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';
import { Spinner, Container } from 'react-bootstrap';

class FullPost extends Component {
  state = {
    post: {},
  };
  componentDidMount() {
    if (this.props.match.params.id)
      this.props.onFetchFullPost(this.props.match.params.id);
  }
  render() {
    let lol;
    if (!this.props.post.id) {
      lol = (
        <Spinner
          animation="border"
          role="status"
          className="spinner-round mx-auto my-5"
        >
          <span className="sr-only">Loading...</span>
        </Spinner>
      );
    } else {
      lol = <Answers />;
    }
    return (
      <Fragment>
        <Container className="d-flex flex-column justify-content-between pt-5 mt-5">
          <Question post={this.props.post} />
          {lol}
        </Container>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    post: state.fullPost.post,
    error: state.fullPost.error,
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
)(withRouter(FullPost));
