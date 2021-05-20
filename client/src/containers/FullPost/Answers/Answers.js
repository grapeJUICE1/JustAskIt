import React, { useEffect, useState, Fragment } from 'react';
import { Button, Container } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { Image } from 'cloudinary-react';
import * as actions from '../../../store/actions/index';
import { formatDate } from '../../../shared/utils/formatDate';
import Loader from '../../../components/UI/Loader/Loader';
import checkAuth from '../../../hoc/checkAuth';
import LikeDislikeButtons from '../../../components/LikeDislikeButtons/LikeDislikeButtons';
import SubmitPostAnswer from '../../../components/SubmitModals/SubmitPostAnswer/SubmitPostAnswer';

import { useAlert } from 'react-alert';

import Comments from '../Comments/Comments';
import styles from './Answers.module.scss';

const Answers = (props) => {
  useEffect(() => {
    props.onFetchAnswers(props.postId);
  }, [props.post]);

  const [ansToEdit, setAnsToEdit] = useState(null);
  const [editQues, setEditQues] = useState(false);
  const [submit, setSubmit] = useState(false);

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setAnsToEdit(null);
    setSubmit(false);
    setEditQues(false);
  };
  const handleShow = () => {
    setShow(true);
  };

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
          />

          <div
            className={`ml-5 ${styles.ans_content}`}
            dangerouslySetInnerHTML={{ __html: `${ans.content}` }}
          ></div>

          <br />
          <span className="ml-auto">
            <p
              style={{
                fontWeight: 'bold',
                color: 'rgb(59, 59, 85)',
                fontSize: '0.8rem',
              }}
            >
              answered {formatDate(ans.createdAt)}
            </p>
            <Image
              cloudName="grapecluster"
              publicId={ans.postedBy.photo}
              width="30"
              height="30"
              className="rounded-circle"
              crop="scale"
            />

            <Button className="mr-0 mt-0 pt-0 ml-auto" variant="link" size="sm">
              <Link to={`/profile/${ans.postedBy._id}`}>
                {ans.postedBy.name}
              </Link>
            </Button>
          </span>
          <div>
            {props.user && props.user._id === ans.postedBy._id && (
              <>
                <Button
                  size="sm"
                  className="ml-3"
                  variant="outline-secondary"
                  onClick={() => {
                    setAnsToEdit(ans);
                    handleShow();
                  }}
                >
                  edit
                </Button>
                <Button
                  size="sm"
                  className="ml-3"
                  variant="outline-danger"
                  onClick={() => props.onDelete('answer', ans._id)}
                >
                  delete
                </Button>
              </>
            )}
          </div>
          <br />
          <Comments
            id={ans._id}
            comments={ans.comments}
            forDoc="answer"
            fetchComments={props.onFetchComments}
          />

          <hr />
        </Fragment>
      );
    });
  }

  if (props.deleteSuccessful) {
    alert.success('deleted Successfully');
    props.onResetEditSuccess();
    if (props.deleteSuccessful === 'post') {
      props.history.push('/posts');
    }
  }

  return (
    <>
      <div>
        {props.user?._id === props?.post?.postedBy?._id ? (
          <>
            <Button
              size="sm"
              className="ml-3"
              variant="outline-secondary"
              onClick={() => {
                setEditQues(true);
                handleShow();
              }}
            >
              edit
            </Button>
            <Button
              size="sm"
              className="ml-3"
              variant="outline-danger"
              onClick={() => {
                props.onDelete('post', props.post._id);
              }}
            >
              delete
            </Button>
          </>
        ) : (
          ''
        )}
      </div>
      <Container className="d-flex flex-column justify-content-between pt-5">
        <h3>
          <strong>
            {props.total} {props.total > 1 ? 'Answers' : 'Answer'}
          </strong>
          <br />
          <br />
          <div>
            <Button
              variant="dark"
              size="lg"
              onClick={() => {
                setSubmit(true);
                handleShow();
              }}
            >
              Submit Answer
            </Button>
          </div>

          <br />
          <hr />
        </h3>

        {answers}
        {(props.user && ansToEdit) ||
        (props.user && submit) ||
        (props.user && editQues) ? (
          <SubmitPostAnswer
            type={
              ansToEdit
                ? 'answer-edit'
                : editQues
                ? 'edit'
                : submit
                ? 'answer'
                : null
            }
            postId={ansToEdit ? ansToEdit._id : props.post._id}
            editedTitle={editQues ? props.post.title : null}
            editedTags={editQues ? props.post.tags : null}
            editedContent={
              // props.post.content
              editQues ? props.post.content : ansToEdit ? ansToEdit.content : ''
            }
            show={show}
            handleShow={handleShow}
            handleClose={() => handleClose()}
            editSuccessful={!submit ? props.editSuccessful : null}
            submitSuccessful={
              !ansToEdit && !editQues ? props.submitSuccessful : null
            }
            onSubmitPost={props.onSubmitPost}
            error={props.submitError}
            loading={props.submitLoading}
            onResetEditSuccess={props.onResetEditSuccess}
          />
        ) : null}
      </Container>
    </>
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
    editSuccessful: state.fullPost.editSuccessful,
    submitSuccessful: state.fullPost.submitSuccessful,
    submitError: state.fullPost.submitError,
    submitLoading: state.fullPost.submitLoading,
    deleteError: state.fullPost.deleteError,
    deleteSuccessful: state.fullPost.deleteSuccessful,
    deleteLoading: state.fullPost.deleteLoading,
    user: state.auth.user,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onFetchAnswers: (id) => dispatch(actions.fetchAnswers(id)),
    onLikeDislikeAnswer: (id, likeordislike) =>
      dispatch(actions.LikeDislikeAnswer(id, likeordislike)),
    onFetchComments: (id, forDoc) =>
      dispatch(actions.fetchComments(id, forDoc)),
    onResetEditSuccess: () => dispatch(actions.resetEditSuccess()),
    onDelete: (type, postId) => dispatch(actions.deletePost(type, postId)),
    onSubmitPost: (
      title,
      content,
      userId,
      tags,
      contentWordCount,
      type,
      postId
    ) =>
      dispatch(
        actions.submitPost(
          title,
          content,
          userId,
          tags,
          contentWordCount,
          type,
          postId
        )
      ),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(checkAuth(withRouter(Answers)));
