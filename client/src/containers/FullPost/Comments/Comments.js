import { Button } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
// import * as actions from '../../../store/actions/index'

import * as actions from '../../../store/actions/index';
import { formatDate } from '../../../shared/utils/formatDate';
import LikeDislikeButtons from '../../../components/LikeDislikeButtons/LikeDislikeButtons';

const Comments = ({
  id,
  forDoc,
  fetchComments,
  comments,
  onLikeDislikeComments,
}) => {
  useEffect(() => {
    if (id) {
      fetchComments(id, forDoc);
    }
  }, [id]);
  return (
    <div>
      <hr />
      {comments
        ? comments.map((cmnt) => (
            <Fragment key={cmnt._id}>
              <LikeDislikeButtons
                userDidLike={cmnt.userDidLike}
                userDidDislike={cmnt.userDidDislike}
                onLikeDislikePost={onLikeDislikeComments}
                isComment={true}
                post={cmnt}
                isSmall={true}
                // getUsersFormerReactions={getUsersFormerReactionsOnThisPost}
              />
              <small>{cmnt.content}</small>

              <Button variant="link" size="sm" className="text-info text">
                <small>
                  {' '}
                  -{' '}
                  <Link to={`/profile/${cmnt.postedBy._id}`}>
                    {cmnt.postedBy.name}
                  </Link>{' '}
                </small>
              </Button>
              <small className="text-muted">{formatDate(cmnt.createdAt)}</small>
              <hr />
            </Fragment>
          ))
        : null}
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLikeDislikeComments: (id, forDoc, likeordislike) =>
      dispatch(actions.likeDislikeComments(id, forDoc, likeordislike)),
  };
};
export default connect(null, mapDispatchToProps)(Comments);
