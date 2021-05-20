import React, { Component } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import Loader from '../../../components/UI/Loader/Loader';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions/index';
import { withAlert } from 'react-alert';

class UploadImage extends Component {
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
  showSuccessAlert = () => {
    if (this.props.editSuccessful) {
      this.props.alert.success('Profile Edited Sucessfully');
    }
  };
  onSubmit = async () => {
    const formData = new FormData();
    formData.append('photo', this.btnRef.current.files[0]);
    await this.props.onUploadPhoto(formData);
    if (!this.props.editErr) {
      this.handleClose();
      this.showSuccessAlert();
    }
  };
  _onChange = () => {
    var file = this.btnRef.current.files[0];
    if (!file) {
      this.setState({
        imgSrc: '',
      });
      return;
    }
    let reader = new FileReader();
    let url = reader.readAsDataURL(file);

    reader.onloadend = function (e) {
      this.setState({
        imgSrc: [reader.result],
      });
    }.bind(this);
  };

  render() {
    return (
      <>
        <br />
        <Button variant="dark" onClick={this.handleShow} size="sm">
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
              <br />
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
    editSuccessful: state.profile.editSuccessful,
    error: state.profile.error,
    editError: state.profile.editError,
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
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAlert()(UploadImage));
