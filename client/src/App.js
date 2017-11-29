import React, { Component } from 'react';
import NavBar from './components/NavBar';
import {Route} from 'react-router-dom';
import FeedContainer from './components/feed/FeedContainer';
import Base from './components/Base';
import './App.css';

class App extends Component {


  render(){
    return(
      <div>
        <NavBar/>
        <Route exact path='/' component={FeedContainer}/>
        <Route path='/index' component={Base}/>
      </div>
    )
  }
}



export default App;
