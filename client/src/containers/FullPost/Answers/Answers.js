import React, { Component, Fragment } from 'react';
import { Button, Container } from 'react-bootstrap';
import { connect } from 'react-redux';

import * as actions from '../../../store/actions/index';
import { formatDate } from '../../../shared/utils/formatDate';
import Loader from '../../../components/UI/Loader/Loader';
import checkAuth from '../../../hoc/checkAuth';

class Answers extends Component {
  componentDidMount() {
    this.props.onFetchAnswers(this.props.postId);
  }

  render() {
    let answers;
    if (this.props.loading) {
      answers = <Loader />;
    } else {
      answers = this.props.answers.map((ans) => (
        <Fragment key={ans._id}>
          <h5>{ans.content}</h5>
          <br />
          <p
            className="ml-auto"
            style={{ fontWeight: 'bold', color: 'rgb(59, 59, 85)' }}
          >
            answered {formatDate(ans.createdAt)}
          </p>
          <p className="ml-auto">
            <Button className="mr-0 mt-0 pt-0" variant="link" size="sm">
              {ans.postedBy.name}
            </Button>
          </p>
          <br />
          <br />
          <br />
          <br />
          <br />
        </Fragment>
      ));
    }
    return (
      <Container className="d-flex flex-column justify-content-between pt-5">
        {answers}
      </Container>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    answers: state.answers.answers,
    error: state.answers.error,
    post: state.fullPost.post,
    loading: state.answers.loading,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onFetchAnswers: (id) => dispatch(actions.fetchAnswers(id)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(checkAuth(Answers));
