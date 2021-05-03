import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';

import Posts from '../Posts/Posts';
import { formatDate } from '../../shared/utils/formatDate';

import './profile.css';

class profile extends Component {
  componentDidMount() {
    this.props.onFetchUserData(this.props.match.params.userID);
    // window.scrollTo(0, 0);
  }
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
                      src="https://bootdey.com/img/Content/avatar/avatar7.png"
                      alt="Admin"
                      className="rounded-circle"
                      width={150}
                    />
                    <div className="mt-3">
                      <h4>{this.props.profile.name}</h4>
                      <p className="text-secondary mb-1">
                        Full Stack Developer
                      </p>

                      <p className="text-secondary mb-1">
                        Joined at {formatDate(this.props.profile.joinedAt)}
                      </p>
                      <button className="btn btn-primary">Follow</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card mt-3">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                    <h6 className="mb-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-globe mr-2 icon-inline"
                      >
                        <circle cx={12} cy={12} r={10} />
                        <line x1={2} y1={12} x2={22} y2={12} />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                      Website
                    </h6>
                    <span className="text-secondary">https://bootdey.com</span>
                  </li>
                </ul>
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
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onFetchUserData: (id) => dispatch(actions.getUserData(id)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(profile);
