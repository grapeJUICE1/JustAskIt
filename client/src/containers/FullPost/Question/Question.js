import { connect } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { timeSince } from '../../../shared/utils/formatDate';
import styles from './Question.module.scss';
import axios from '../../../axios-main';

import * as actions from '../../../store/actions/index';

const Question = (props) => {
  const [buttonStyle, setButtonStyle] = useState({});
  const [buttonStyle2, setButtonStyle2] = useState({});
  const hello = async () => {
    if (!props.post.id) return;
    const userLikes = await axios.get(
      `http://localhost:7000/api/v1/posts/${props.post.id}/get-all-reactions-of-user`
    );
    if (
      userLikes.data.data.docs.length > 0
        ? userLikes.data.data.docs[0].type === 'like'
          ? true
          : false
        : false
    ) {
      setButtonStyle({ backgroundColor: 'orange' });
      setButtonStyle2({});
    } else if (
      userLikes.data.data.docs.length > 0
        ? userLikes.data.data.docs[0].type === 'dislike'
          ? true
          : false
        : false
    ) {
      setButtonStyle2({ backgroundColor: 'orange' });
      setButtonStyle({});
    } else {
      setButtonStyle({});
      setButtonStyle2({});
    }
  };
  useEffect(() => {
    hello();

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
      <span>
        <Button
          style={buttonStyle}
          variant="secondary"
          size="sm"
          onClick={async (e) => {
            await props.onLikeDislikePost(props.post.id, 'like');
            await hello();
          }}
        >
          <i className="fas fa-angle-up"></i>
        </Button>
        <br />
        <span className="mx-2">{props.post.voteCount}</span>
        <br />
        <Button
          style={buttonStyle2}
          variant="secondary"
          size="sm"
          onClick={async (e) => {
            await props.onLikeDislikePost(props.post.id, 'dislike');
            await hello();
          }}
        >
          <i className="fas fa-angle-down"></i>
        </Button>
      </span>
      <p className={`ml-5 ${styles.post_content}`}>{props.post.content}</p>
    </Container>
  );
};
const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    // post: state.fullPost.post,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLikeDislikePost: (id, likeordislike) =>
      dispatch(actions.LikePost(id, likeordislike)),
    onLogout: () => dispatch(actions.Logout()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Question);
