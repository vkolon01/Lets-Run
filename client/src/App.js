import React, { Component } from 'react';
import NavBar from './components/NavBar';
import {Route} from 'react-router-dom';
import FeedContainer from './components/feed/FeedContainer';
import Base from './components/Base';
import './App.css';
import Messages from './components/Messages';
import LoginPage from './components/auth/LoginPage';
import RegistrationPage from './components/auth/RegistrationPage';

class App extends Component {


  render(){
    return(
      <div>
        <div className="header">
          <NavBar/>
          <Messages/>
        </div>
        <Route exact path='/' component={FeedContainer}/>
        <Route path='/index' component={Base}/>
        <Route path="/sign_in" component={LoginPage}/>
        <Route path="/register" component={RegistrationPage}/>
      </div>
    )
  }
}



export default App;
