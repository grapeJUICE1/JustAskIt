import React, { useEffect, Fragment } from 'react';
import { Button, Container } from 'react-bootstrap';
import { connect } from 'react-redux';

import * as actions from '../../../store/actions/index';
import { formatDate } from '../../../shared/utils/formatDate';
import Loader from '../../../components/UI/Loader/Loader';
import checkAuth from '../../../hoc/checkAuth';
import LikeDislikeButtons from '../../../components/LikeDislikeButtons/LikeDislikeButtons';
import { useAlert } from 'react-alert';

import styles from './Answers.module.scss';

const Answers = (props) => {
  useEffect(() => {
    props.onFetchAnswers(props.postId);
  }, []);
  const alert = useAlert();
  let answers;
  if (props.error) {
    alert.error('OOps .... Error occured ... try again later');
    answers = <h3>OOps .... Error occured ... try again later</h3>;
  } else if (props.loading) {
    answers = <Loader />;
  } else {
    // getUsersFormerReactionsOnThisPost();
    answers = props.answers.map((ans) => (
      <Fragment key={ans._id}>
        <h3>
          <strong>
            {props.total} {props.total > 1 ? 'Answers' : 'Answer'}
          </strong>
        </h3>
        <br />
        <hr />
        <LikeDislikeButtons
          userDidLike={ans.userDidLike}
          userDidDislike={ans.userDidDislike}
          onLikeDislikePost={props.onLikeDislikeAnswer}
          post={ans}
          // getUsersFormerReactions={getUsersFormerReactionsOnThisPost}
        />

        <p className={`ml-5 ${styles.ans_content}`}>{ans.content}</p>

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
};

const mapStateToProps = (state) => {
  return {
    answers: state.answers.answers,
    error: state.answers.error,
    post: state.fullPost.post,
    loading: state.answers.loading,
    total: state.answers.total,
    userDidLike: state.answers.userDidLike,
    userDidDislike: state.answers.userDidDislike,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onFetchAnswers: (id) => dispatch(actions.fetchAnswers(id)),
    onLikeDislikeAnswer: (id, likeordislike) =>
      dispatch(actions.LikeDislikeAnswer(id, likeordislike)),
    onCheckUserDidLikeDislike: (id) =>
      dispatch(actions.checkUsersLikeDislikeAnswer(id)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(checkAuth(Answers));
