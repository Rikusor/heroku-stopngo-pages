import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as axios from 'axios';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

import { containerStyles } from '../styles/index';

class DashBoard extends Component {

  constructor(props) {
    super(props);

    const id = this.props.match.params.id;

    this.state = {
      id,
      appName: '',
      timeout: undefined,
      error: false,
      saving: false,
      saved: false,
    };

  }

  componentWillMount () {
    axios.get('/api/information/' + this.state.id)
      .then(res => this.setState({appName: res.data.name, timeout: res.data.currentTimer}))
      .then(_ => {
        const script = document.createElement("script");

        script.onload = () => {
          window.Boomerang.init({app: this.state.appName, addon: 'stopngo'}); // eslint-disable-line
        };

        script.src = "https://s3.amazonaws.com/assets.heroku.com/boomerang/boomerang.js";
        script.async = false;

        document.body.appendChild(script);
      })
      .catch(err => this.setState({error: true, errorMessage: 'Error loading information'}));
  }

  handleChange = (e, index, value) => {
    this.setState({timeout: value, saved: false, saving: false})
  };

  handleSubmit = () => {
    this.setState({saved: false, saving: true})
    axios.post('/api/update/' + this.state.id, { timeout: this.state.timeout })
      .then(res => this.setState({saved: true, saving: false}))
      .catch(err => this.setState({error: true, errorMessage: 'Error saving information. Please try again later.'}));
  };

  render() {

    let action = <RaisedButton label="Save" primary={true} onClick={this.handleSubmit} />

    if (this.state.saving) {
      action = <span>Saving...&nbsp;&nbsp;&nbsp; <CircularProgress size={25} /></span>
    }

    if (this.state.saved) {
      action = <b style={{color: 'green'}}>Saved!</b>
    }

    return (
      <div style={containerStyles}>
        <h1>Stop 'N Go</h1>

        <p>
          Configure settings for <b>{this.state.appName}</b>
        </p>
        <p><b>{this.state.appName}</b> <br /> should be considered inactive after</p>
        <SelectField
          style={{textAlign: "left", width: "9em"}}
          value={this.state.timeout}
          onChange={this.handleChange}
        >
          <MenuItem value="5" primaryText="5 minutes" />
          <MenuItem value="15" primaryText="15 minutes" />
          <MenuItem value="30" primaryText="30 minutes" />
          <MenuItem value="45" primaryText="45 minutes" />
          <MenuItem value="60" primaryText="60 minutes" />
        </SelectField>

        <p>
          {action}
        </p>

        {this.state.error &&
        <p style={{color: "red"}}>
          {this.state.errorMessage}
        </p>
        }
      </div>
    );
  }
}

DashBoard.propTypes = {
  id: PropTypes.object
};

export default DashBoard;
