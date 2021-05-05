import React, { Component } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import Loader from '../../../components/UI/Loader/Loader';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions/index';

class EditModal extends Component {
  state = {
    show: false,
    imgSrc: '',
  };

  btnRef = React.createRef();
  handleShow = () => {
    this.setState({ show: true });
  };
  handleClose = () => {
    this.setState({ show: false });
  };
  onSubmit = async () => {
    const formData = new FormData();
    formData.append('photo', this.btnRef.current.files[0]);
    await this.props.onUploadPhoto(formData);
    this.handleClose();
  };
  _onChange = () => {
    var file = this.btnRef.current.files[0];
    var reader = new FileReader();
    var url = reader.readAsDataURL(file);

    reader.onloadend = function (e) {
      this.setState({
        imgSrc: [reader.result],
      });
    }.bind(this);
    console.log(this.btnRef.current.files[0]); // Would see a path?
  };

  render() {
    return (
      <>
        <br />
        <Button variant="primary" onClick={this.handleShow} size="sm">
          upload image
        </Button>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Profile</Modal.Title>
          </Modal.Header>
          {this.props.modalLoading ? (
            <Loader />
          ) : (
            <Modal.Body>
              <Form>
                <input
                  ref={this.btnRef}
                  type="file"
                  accept="image/*"
                  name="user[image]"
                  multiple="true"
                  onChange={this._onChange}
                />

                <Button variant="primary" onClick={this.onSubmit}>
                  Submit
                </Button>
              </Form>
              <img
                src={this.state.imgSrc}
                alt="profile pic"
                width="400px"
                height="350px"
              />
            </Modal.Body>
          )}
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
    loading: state.profile.loading,
    modalLoading: state.profile.modalLoading,
    user: state.auth.user,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onUploadPhoto: (data) => dispatch(actions.uploadPhoto(data)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(EditModal);
