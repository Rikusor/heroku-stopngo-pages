import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

import errorPage from './views/error-page';
import dashboard from './views/dashboard';

injectTapEventPlugin();

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <Router history>
          <div>
            <Route path='/error-page/:id' component={errorPage} />
            <Route path='/dashboard/:id' component={dashboard} />
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
