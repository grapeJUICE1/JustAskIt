import { connect } from 'react-redux';
import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { timeSince } from '../../../shared/utils/formatDate';
import styles from './Question.module.scss';
import LikeDislikeButtons from '../../../components/LikeDislikeButtons/LikeDislikeButtons';

import * as actions from '../../../store/actions/index';
import Comments from '../Comments/Comments';
const Question = (props) => {
  const getUsersFormerReactionsOnThisPost = async () => {
    if (!props.post.id) return;
    await props.onCheckUserDidLikeDislike(props.post.id);
  };

  useEffect(() => {
    getUsersFormerReactionsOnThisPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.post.id]);

  return (
    <Container
      className={'d-flex flex-column justify-content-between flex-wrap '}
    >
      <h2 className={styles.Question}>
        <strong> {props.post.title} </strong>
      </h2>
      <br />
      <h6>
        Asked <strong>{timeSince(props.post.createdAt)} ago</strong>
        &nbsp; &nbsp; &nbsp; Viewed <strong>{props.post.views} times</strong>
      </h6>
      <hr />

      <LikeDislikeButtons
        userDidLike={props.userDidLike}
        userDidDislike={props.userDidDislike}
        onLikeDislikePost={props.onLikeDislikePost}
        post={props.post}
        getUsersFormerReactions={getUsersFormerReactionsOnThisPost}
      />
      <p className={`ml-5 ${styles.post_content}`}>{props.post.content}</p>

      <Comments
        id={props.post._id}
        forDoc="post"
        comments={props.comments}
        fetchComments={props.onFetchComments}
      />
    </Container>
  );
};
const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    userDidLike: state.fullPost.userDidLike,
    comments: state.fullPost.comments,
    userDidDislike: state.fullPost.userDidDislike,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLikeDislikePost: (id, likeordislike) =>
      dispatch(actions.LikeDislikePost(id, likeordislike)),
    onCheckUserDidLikeDislike: (id) =>
      dispatch(actions.checkUsersLikeDislikePost(id)),
    onFetchComments: (id, forDoc) =>
      dispatch(actions.fetchComments(id, forDoc)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Question);
