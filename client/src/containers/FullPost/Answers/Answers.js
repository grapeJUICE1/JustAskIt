import React, { useEffect, Fragment } from 'react';
import { Button, Container } from 'react-bootstrap';
import { connect } from 'react-redux';

import * as actions from '../../../store/actions/index';
import { formatDate } from '../../../shared/utils/formatDate';
import Loader from '../../../components/UI/Loader/Loader';
import checkAuth from '../../../hoc/checkAuth';
import LikeDislikeButtons from '../../../components/LikeDislikeButtons/LikeDislikeButtons';

const Answers = (props) => {
  const getUsersFormerReactionsOnThisPost = async (ans = null) => {
    if (!ans) {
      for (let ans of props.answers) {
        await props.onCheckUserDidLikeDislike(ans._id);
      }
    } else {
      await props.onCheckUserDidLikeDislike(ans._id);
    }
  };

  useEffect(() => {
    props.onFetchAnswers(props.postId);
  }, []);

  useEffect(() => {
    getUsersFormerReactionsOnThisPost();
  }, []);
  let answers;

  if (props.loading) {
    answers = <Loader />;
  } else {
    // getUsersFormerReactionsOnThisPost();
    answers = props.answers.map((ans) => (
      <Fragment key={ans._id}>
        <h5>
          <span>
            <LikeDislikeButtons
              userDidLike={ans.userDidLike}
              userDidDislike={ans.userDidDislike}
              onLikeDislikePost={props.onLikeDislikeAnswer}
              post={ans}
              getUsersFormerReactions={getUsersFormerReactionsOnThisPost}
            />
          </span>
          {ans.content}
        </h5>
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
