import React, {Component} from 'react';
import LoginPage from './auth/LoginPage';
import RegistrationPage from './auth/RegistrationPage';
import {Route, Link} from 'react-router-dom';
import LoginStore from '../stores/LoginStore';
import AuthService from '../services/AuthService';
import MessagesStore from '../stores/MessagesStore';

class NavBar extends Component{

  constructor(){
    super();
    this.state={
      username: LoginStore.username
    }
    this.update = this.update.bind(this);
  }
  componentWillMount(){
    LoginStore.on('change',this.update);
  }
  componentWillUnmount(){
    LoginStore.removeListener('change', this.update);
  }
  update(){
    this.setState({
      username: LoginStore.username
    })
  }

  render(){
    const username = this.state.username;
    const summary = this.state.summary;
    return (
      <div className="navbar">
        <div className="logo"><Link to="/">Home</Link></div>
        <div><Link to="/index">Base</Link></div>
        {summary}
        {LoginStore.isLoggedIn() ? (
          <div className="navbar_auth">
            <p> user: {username} </p>
            <ul>
              <li><Link to="/" onClick={AuthService.logout}>Log out</Link></li>
            </ul>
          </div>
        ) : (
          <div className="navbar_auth">
            <ul>
              <li><Link to="/sign_in">Sign in</Link></li>
              <li><Link to="/register">Register</Link></li>
            </ul>
          </div>
        )}

        <hr/>
        <Route path="/sign_in" component={LoginPage}/>
        <Route path="/register" component={RegistrationPage}/>
      </div>
    )
  }
}

export default NavBar;
