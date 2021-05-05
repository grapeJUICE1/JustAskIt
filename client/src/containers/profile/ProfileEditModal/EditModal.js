import React, { Component } from 'react';
import { Button, Modal, Form, Col } from 'react-bootstrap';
import Loader from '../../../components/UI/Loader/Loader';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions/index';

class EditModal extends Component {
  state = {
    show: false,
    editableFields: {
      name: this.props.user.name,
      email: this.props.user.email,
      bio: this.props.user.bio,
      links: this.props.user.links,
    },
  };

  handleShow = () => {
    this.setState({ show: true });
  };
  handleClose = () => {
    this.setState({ show: false });
  };
  onSubmit = async () => {
    await this.props.onEditData(this.state.editableFields);
    this.handleClose();
  };
  render() {
    return (
      <>
        <Button variant="primary" onClick={this.handleShow}>
          Edit Profile
        </Button>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header
            style={{
              margin: '0 auto',
            }}
          >
            <Modal.Title>
              <strong>Edit Profile</strong>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Modal.Title>User Data</Modal.Title>
              <hr />
              {Object.keys(this.state.editableFields).map((val, id) => {
                const editableFields = this.state.editableFields;
                if (val !== 'links') {
                  return (
                    <Form.Group controlId={val} key={id}>
                      <Form.Label>{val}</Form.Label>
                      <Form.Control
                        type="text"
                        as={val === 'bio' ? 'textarea' : 'input'}
                        placeholder={`Enter ${val}`}
                        value={editableFields[val]}
                        onChange={(e) =>
                          this.setState({
                            editableFields: {
                              ...editableFields,
                              [val]: e.target.value,
                            },
                          })
                        }
                      />
                    </Form.Group>
                  );
                } else {
                  return (
                    <Form.Group>
                      <Modal.Title>Links</Modal.Title>
                      <hr />
                      {Object.keys(editableFields.links).map((val, id) => {
                        return (
                          <Form.Row key={id}>
                            <Form.Label column="sm" lg={2}>
                              {val}
                            </Form.Label>
                            <Col>
                              <Form.Control
                                size="sm"
                                type="text"
                                value={editableFields.links[val]}
                                onChange={(e) =>
                                  this.setState({
                                    editableFields: {
                                      ...editableFields,
                                      links: {
                                        ...editableFields.links,
                                        [val]: e.target.value,
                                      },
                                    },
                                  })
                                }
                                placeholder={`enter your ${val} link`}
                              />
                            </Col>
                          </Form.Row>
                        );
                      })}
                    </Form.Group>
                  );
                }
              })}
              <Button variant="primary" onClick={this.onSubmit}>
                Submit
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    profile: state.profile.profile,
    error: state.profile.error,
    user: state.auth.user,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onEditData: (data) => dispatch(actions.editUserData(data)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(EditModal);
