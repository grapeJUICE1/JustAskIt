import React, { Component } from 'react';
import { Container, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';
import UploadImage from './uploadImageModal/UploadImage';

import Posts from '../Posts/Posts';
import { formatDate } from '../../shared/utils/formatDate';

import './profile.css';
import EditModal from './ProfileEditModal/EditModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGithub,
  faInstagram,
  faFacebook,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

class profile extends Component {
  componentDidMount() {
    this.props.onFetchUserData(this.props.match.params.userID);
    // window.scrollTo(0, 0);
  }
  state = {
    show: false,
  };

  handleClose = () => this.setState({ show: false });
  handleShow = () => this.setState({ show: true });

  iconToLink = {
    github: faGithub,
    website: faGlobe,
    facebook: faFacebook,
    twitter: faTwitter,
    instagram: faInstagram,
  };
  render() {
    let profile = (
      <Container>
        <div className="main-body">
          <div className="row gutters-sm">
            <div className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex flex-column align-items-center text-center">
                    <img
                      src={this.props.profile.photo}
                      alt="Admin"
                      className="rounded-circle"
                      width={150}
                    />
                    <UploadImage />

                    <div className="mt-3">
                      <h4>{this.props.profile.name}</h4>
                      <p className="text-secondary mb-1">
                        Full Stack Developer
                      </p>

                      <p className="text-secondary mb-1">
                        Joined at {formatDate(this.props.profile.joinedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <br />
              <div className="text-center">
                {this.props.profile.links &&
                  Object.keys(this.props.profile.links).map((val, id) => {
                    if (this.props.profile.links[val]) {
                      return (
                        <>
                          <Button
                            as="a"
                            key={id}
                            variant="secondary"
                            href={this.props.profile.links[val]}
                          >
                            <FontAwesomeIcon icon={this.iconToLink[val]} />
                          </Button>
                          &nbsp;
                        </>
                      );
                    }
                  })}
              </div>
            </div>
            <div className="col-md-8 ml-0 ">
              <div className="card mb-3">
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Name</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      {this.props.profile.name}
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Email</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      {this.props.profile.email}
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Bio</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      {this.props.profile.bio}
                    </div>
                  </div>
                </div>

                {this.props.loggedInUser ? (
                  this.props.loggedInUser._id === this.props.profile._id ? (
                    <EditModal />
                  ) : (
                    ''
                  )
                ) : (
                  ''
                )}
              </div>
              {this.props.profile._id &&
                this.props.match.params.userID === this.props.profile._id && (
                  <Posts isProfile={true} userId={this.props.profile._id} />
                )}
            </div>
          </div>
        </div>
      </Container>
    );

    if (!this.props.error) {
      return profile;
    } else {
      return <h1 className="mt-5 pt-5 text-center">{this.props.error}</h1>;
    }
  }
}
const mapStateToProps = (state) => {
  return {
    profile: state.profile.profile,
    error: state.profile.error,
    loading: state.profile.loading,
    loggedInUser: state.auth.user,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onFetchUserData: (id) => dispatch(actions.getUserData(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(profile);
