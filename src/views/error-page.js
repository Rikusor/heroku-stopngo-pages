/* eslint-disable no-restricted-globals */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from 'material-ui/CircularProgress';
import * as axios from 'axios';

import { containerStyles } from '../styles/index';

class ErrorPage extends Component {

  constructor(props) {
    super(props);

    const id = this.props.match.params.id;

    this.state = {
      id,
      status: 'Checking...',
      restoring: true,
      reloaded: false,
      checks: 0,
      error: false,
      reloading: false,
      errorMessage: ''
    };

    setInterval(() => {

      if (this.state.checks > 3 && this.state.status !== 'ACTIVE') {
        const pokeUrl = document.referrer.replace('http://', 'https://');
        axios.get(pokeUrl);
      }

      if (this.state.checks > 20) {
        this.setState({restoring: false, error: true, errorMessage: `There was issue re-activating your application. Please submit issue with id "${this.state.id}" and the time of the issue via Heroku support platform. You can try to re-active the application by reloading the page or do it manually via the Heroku Dashboard / CLI. We apologise for the inconvenience.` })
      }

      if (!this.state.error && !this.state.reloading && this.state.status === 'ACTIVE') {
        setTimeout(() => {
          try {
            top.window.location.href = document.referrer;
            this.setState({reloading: true});
          } catch (e) {
            this.setState({restoring: false, reloaded: true});
          }
        }, 1000);
        setTimeout(() => {
          this.setState({restoring: false, reloaded: true});
        }, 30000)
      } else if (!this.state.error) {
        this.getStatus(this.state.id);
      }
    }, 1000);
  }

  componentWillMount () {
    const id = this.props.match.params.id;
    this.getStatus(id);
  }

  getStatus () {
    if (!this.state.reloaded && !this.state.error) {
      axios.get('/api/status/' + this.state.id)
        .then(res => this.setState({status: res.data.status}))
        .catch(err => this.setState({status: 'Error loading status'}));

      this.setState({checks: this.state.checks + 1})
    }
  }

  render() {
    return (
      <div style={containerStyles}>
        <h1>Stop 'N Go</h1>
        <p>
          You have reached an inactive application.
        </p>

        <p>Application current status: {this.state.status}</p>

        {this.state.restoring &&
        <p>
          Restoring your application&nbsp;&nbsp;&nbsp;<CircularProgress size={25} />
        </p>
        }

        {this.state.error &&
        <p style={{color: "red"}}>
          {this.state.errorMessage}
        </p>
        }

        {this.state.reloaded &&
          <div>
          <p style={{color: "red"}}>
            Unfortunately we were unable to automatically refresh the page.
          </p>
          <p style={{color: "red"}}>Please refresh the website manually using the refresh function of your browser.</p>
          </div>
        }

      </div>
    );
  }
}

ErrorPage.propTypes = {
  id: PropTypes.object
};

export default ErrorPage;
