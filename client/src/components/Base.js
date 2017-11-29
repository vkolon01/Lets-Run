import React, {Component} from 'react';
import {PropTypes} from 'prop-types';
import {Link} from 'react-router-dom';
import Messages from './Messages';

class Base extends Component{
  render(){
    return(
      <div>
        <Messages/>
        <h1>hi</h1>
      </div>
    )
  }
}

export default Base;
