import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

const LikeDislikeButtons = (props) => {
  const [likeButtonStyle, setlikeButtonStyle] = useState({});
  const [disLikeButtonStyle, setdisLikeButtonStyle] = useState({});

  const activeLikeDislikeButtonStyle = { backgroundColor: 'rgb(198, 82, 130)' };

  useEffect(() => {
    if (props.userDidLike) {
      setlikeButtonStyle(activeLikeDislikeButtonStyle);
      setdisLikeButtonStyle({});
    } else if (props.userDidDislike) {
      setdisLikeButtonStyle(activeLikeDislikeButtonStyle);
      setlikeButtonStyle({});
    } else {
      setlikeButtonStyle({});
      setdisLikeButtonStyle({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.userDidLike, props.userDidDislike]);

  return (
    <span>
      <Button
        variant="secondary"
        size="sm"
        style={{ ...likeButtonStyle }}
        onClick={async (e) => {
          if (props.post.id) {
            await props.onLikeDislikePost(props.post.id, 'like');
          } else {
            await props.onLikeDislikePost(props.post._id, 'like');
          }
        }}
      >
        <i className="fas fa-angle-up"></i>
      </Button>
      <br />
      <span className="mx-2">{props.post.voteCount}</span>
      <br />
      <Button
        variant="secondary"
        size="sm"
        style={{ ...disLikeButtonStyle }}
        onClick={async (e) => {
          if (props.post.id) {
            await props.onLikeDislikePost(props.post.id, 'dislike');
          } else {
            await props.onLikeDislikePost(props.post._id, 'dislike');
          }
        }}
      >
        <i className="fas fa-angle-down"></i>
      </Button>
    </span>
  );
};

export default LikeDislikeButtons;
