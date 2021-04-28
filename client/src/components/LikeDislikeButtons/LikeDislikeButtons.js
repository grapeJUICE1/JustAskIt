import React, { useState, useEffect } from 'react';
// import { Fragment } from 'react';
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
      <small>
        <Button
          variant="secondary"
          size="sm"
          style={{
            ...likeButtonStyle,
            padding: props.isSmall ? '0' : null,
          }}
          onClick={async (e) => {
            if (props.isComment) {
              await props.onLikeDislikePost(props.post._id, 'Answer', 'like');
            } else if (props.post.id) {
              await props.onLikeDislikePost(props.post.id, 'like');
            } else {
              await props.onLikeDislikePost(props.post._id, 'like');
            }
          }}
        >
          <i className="fas fa-angle-up"></i>
        </Button>
        {!props.isSmall && (
          <span>
            <br />
            <span className="mx-2">{props.post.voteCount}</span>
            <br />
          </span>
        )}

        <Button
          variant="secondary"
          size="sm"
          style={{
            ...disLikeButtonStyle,
            padding: props.isSmall ? '0' : null,
          }}
          onClick={async (e) => {
            if (props.isComment) {
              await props.onLikeDislikePost(
                props.post._id,
                'Answer',
                'dislike'
              );
              return;
            }
            if (props.post.id) {
              await props.onLikeDislikePost(props.post.id, 'dislike');
            } else {
              await props.onLikeDislikePost(props.post._id, 'dislike');
            }
          }}
        >
          <i className="fas fa-angle-down"></i>
        </Button>
        {props.isSmall && <span className="mx-2">{props.post.voteCount}</span>}
      </small>
    </span>
  );
};

export default LikeDislikeButtons;
