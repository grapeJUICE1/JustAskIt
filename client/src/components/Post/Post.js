import React from 'react';
import classnames from 'classnames';
import TimeFromNow from '../../shared/utils/formatDate';
import styles from './Post.module.scss';
import { Button } from 'react-bootstrap';
import { withRouter } from 'react-router';
// console.log(styles);

const Post = (props) => {
  return (
    <div
      className={styles.lol + ' p-3 mt-1'}
      id={`${props.post.slug}`}
      key={props.post.id}
    >
      <Button
        variant="link"
        onClick={() =>
          props.history.push(`/posts/post/${props.post.id}/${props.post.slug}`)
        }
        className={styles.post_title}
      >{`${props.post.title.slice(0, 100)} ...`}</Button>
      <div className="d-flex pt-2">
        <p className="text-muted pr-4">
          <span>
            <i
              className={classnames('fas fa-arrow-up pr-2', {
                'text-success': props.post.voteCount > 0,
              })}
            ></i>
          </span>
          {`${props.post.voteCount} Votes`}
        </p>
        <p className="text-muted pr-4">
          <span>
            <i
              className={classnames('fas fa-comment-alt pr-2', {
                'text-danger': props.post.answerCount > 0,
              })}
            ></i>
          </span>
          {`${props.post.answerCount} answers`}
        </p>
        <p className="text-muted pr-4">
          <span>
            <i
              className={classnames('fas fa-eye pr-2', {
                'text-primary': props.post.views > 0,
              })}
            ></i>
          </span>
          {`${props.post.views} views`}
        </p>
      </div>
      <div className="pt-2">
        {props.post.tags.map((tag) => (
          <div
            key={tag}
            className={styles.tag_inside + ' px-1 py-1 mr-1 mb-1'}
            role="button"
          >
            {tag}
          </div>
        ))}
      </div>
      <div className="d-flex flex-row-reverse flex-end pt-3">
        <div className="d-flex flex-column">
          <small className="text-muted">
            {`Asked ${TimeFromNow(props.post.createdAt)} ago `}
          </small>
          <p>{`${props.post.postedBy.name}`}</p>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Post);
