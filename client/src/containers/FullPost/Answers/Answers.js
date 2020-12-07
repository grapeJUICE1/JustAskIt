import React, { Component, Fragment } from 'react';
import axios from 'axios';
import { Container, Spinner } from 'react-bootstrap';
import { connect } from 'react-redux';

import * as actions from '../../../store/actions/index';

class Answers extends Component {
  componentDidMount() {
    if (!this.props.answers) {
      this.props.onFetchAnswers(this.props.post.id);
    }
  }

  async fetchData() {
    try {
      if (this.props.post.id) {
        const res = await axios.get(
          `http://localhost:7000/api/v1/answers/${this.props.post.id}/get-answers`
        );

        this.setState({
          answers: res.data.data.docs,
          totalAnswers: res.data.results,
        });
      }
    } catch (err) {}
  }
  render() {
    let answers;
    if (!this.props.answers) {
      answers = (
        <Spinner
          animation="border"
          role="status"
          className="spinner-round mx-auto my-5"
        >
          <span className="sr-only">Loading...</span>
        </Spinner>
      );
    } else {
      answers = this.props.answers.map((ans) => (
        <Fragment key={ans._id}>
          <h5>{ans.content}</h5>
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
    answers: state.fullPost.answers,
    error: state.fullPost.error,
    post: state.fullPost.post,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onFetchAnswers: (id) => dispatch(actions.fetchAnswers(id)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Answers);
