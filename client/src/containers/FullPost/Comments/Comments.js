import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../../store/actions/index';

const Comments = ({ id, forDoc, fetchComments, comments }) => {
  useEffect(() => {
    if (id) {
      fetchComments(id, forDoc);
    }
  }, [id]);
  return (
    <div>
      {comments
        ? comments.map((cmnt) => <p key={cmnt._id}>{cmnt.content}</p>)
        : null}
    </div>
  );
};

export default Comments;
