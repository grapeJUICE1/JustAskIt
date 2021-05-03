import React, { useEffect, Fragment } from 'react';
import { Button, Container } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import * as actions from '../../../store/actions/index';
import { formatDate } from '../../../shared/utils/formatDate';
import Loader from '../../../components/UI/Loader/Loader';
import checkAuth from '../../../hoc/checkAuth';
import LikeDislikeButtons from '../../../components/LikeDislikeButtons/LikeDislikeButtons';
import { useAlert } from 'react-alert';

import Comments from '../Comments/Comments';
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
    answers = props.answers.map((ans) => {
      return (
        <Fragment key={ans._id}>
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
            style={{
              fontWeight: 'bold',
              color: 'rgb(59, 59, 85)',
              fontSize: '0.8rem',
            }}
          >
            answered {formatDate(ans.createdAt)}
          </p>
          <Button className="mr-0 mt-0 pt-0 ml-auto" variant="link" size="sm">
            <Link to={`/profile/${ans.postedBy._id}`}>{ans.postedBy.name}</Link>
          </Button>
          <Comments
            id={ans._id}
            comments={ans.comments}
            forDoc="answer"
            fetchComments={props.onFetchComments}
          />
          <br />

          <hr />
        </Fragment>
      );
    });
  }

  return (
    <Container className="d-flex flex-column justify-content-between pt-5">
      <br />
      <h3>
        <strong>
          {props.total} {props.total > 1 ? 'Answers' : 'Answer'}
        </strong>
        <br />
        <br />
        <hr />
      </h3>

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
    // onCheckUserDidLikeDislike: (id) =>
    //   dispatch(actions.checkUsersLikeDislikeAnswer(id)),
    onFetchComments: (id, forDoc) =>
      dispatch(actions.fetchComments(id, forDoc)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(checkAuth(Answers));
