import React from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import Editor from '../../Editor/Editor';

function SubmitPostAnswer() {
  return (
    <Modal>
      <Modal.Header>
        <Modal.Title>
          <strong>Submit Post</strong>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Editor />
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default SubmitPostAnswer;
