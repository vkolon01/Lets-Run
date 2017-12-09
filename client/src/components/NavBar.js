import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import UserStore from '../stores/UserStore';
import AuthService from '../services/AuthService';

class NavBar extends Component{

  constructor(){
    super();
    this.state={
      username: UserStore.username
    }
    this.update = this.update.bind(this);
  }
  componentWillMount(){
    UserStore.on('change',this.update);
  }
  componentWillUnmount(){
    UserStore.removeListener('change', this.update);
  }
  update(){
    this.setState({
      username: UserStore.username
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
        {UserStore.isLoggedIn() ? (
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
      </div>
    )
  }
}

export default NavBar;
