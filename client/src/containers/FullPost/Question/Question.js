import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import { timeSince } from '../../../shared/utils/formatDate';
import styles from './Question.module.scss';

class Question extends Component {
  render() {
    return (
      <Container
        className={'d-flex flex-column justify-content-between flex-wrap '}
      >
        <h2 className={styles.Question}>
          <strong> {this.props.post.title} </strong>
        </h2>
        <br />
        <h6>
          Asked <strong>{timeSince(this.props.post.createdAt)} ago</strong>
          &nbsp; &nbsp; &nbsp; Viewed{' '}
          <strong>{this.props.post.views} times</strong>
        </h6>
        <hr />
        <p>{this.props.post.content}</p>
      </Container>
    );
  }
}

export default Question;
