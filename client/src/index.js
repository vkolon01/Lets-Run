import React from 'react';
import ReactDOM from 'react-dom';
import history from './services/History';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import {Router} from 'react-router-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import App from './App';
import AuthActions from './actions/AuthActions';

injectTapEventPlugin();

let jwt = localStorage.getItem('jwt');
if(jwt){
  AuthActions.loginUser(jwt);
}

ReactDOM.render((
  <MuiThemeProvider muiTheme={getMuiTheme()}>
    <Router history={history}>
      <App/>
    </Router>
  </MuiThemeProvider>), document.getElementById('root'));
registerServiceWorker();
