import React, { Component } from 'react';
import {
  Link
} from 'react-router-dom';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';

import { buttonStyles, containerStyles } from '../../styles/index';

class HeaderLinks extends Component {
  render() {
    const userType = this.props.match.params.userType;
    const path = this.props.location.pathname;

    return (
      <div style={containerStyles}>
        <h1>Fortum order management</h1>
        <Link id='link-to-CCS' to={`/${userType}/forms/CCS`}>
          <RaisedButton
            label='CCS'
            primary={path.indexOf('/CCS') > -1}
            style={buttonStyles}
          />
        </Link>
        <Link id='link-to-CP' to={`/${userType}/forms/CP`}>
          <RaisedButton
            label='CP'
            primary={path.indexOf('/CP') > -1}
            style={buttonStyles}
          />
        </Link>
        <Link id='link-to-OTC-OLD' to={`/${userType}/forms/OTC-OLD`}>
          <RaisedButton
            label='OTC Old customer'
            primary={path.indexOf('/OTC-OLD') > -1}
            style={buttonStyles}
          />
        </Link>
        <Link id='link-to-NEW-CUSTOMER' to={`/${userType}/forms/NEW-CUSTOMER`}>
          <RaisedButton
            label='New Customer'
            primary={path.indexOf('/NEW-CUSTOMER') > -1}
            style={buttonStyles}
          />
        </Link>
      </div>
    );
  }
}

HeaderLinks.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object
};

HeaderLinks.defaultProps = {
  match: {
    params: {
      userType: 'user'
    }
  },
  location: {
    pathname: '/user'
  }
};

export default HeaderLinks;
