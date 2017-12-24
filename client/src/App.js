import React, { Component } from 'react';
import NavBar from './components/NavBar';
import {Route} from 'react-router-dom';
import FeedContainer from './components/feed/FeedContainer';
import './App.css';
import Messages from './components/Messages';
import LoginPage from './components/auth/LoginPage';
import RegistrationPage from './components/auth/RegistrationPage';
import ProfileContainer from './components/users/ProfileContainer';

class App extends Component {


  render(){
    return(
      <div className='outBounds'>
        <div className='main'>
          <div className="header">
            <NavBar/>
            <Messages/>
          </div>
          <Route exact path='/' component={FeedContainer}/>
          <Route path="/sign_in" component={LoginPage}/>
          <Route path="/register" component={RegistrationPage}/>
          <Route path="/user/:user_id" component={ProfileContainer}/>
        </div>
      </div>
    )
  }
}



export default App;
