import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class UserDetails extends Component{

  render(){
    const user = this.props.user;
    const age = "18";
    const fullName = user.firstName + ' ' + user.lastName;
    return (
      <div>
        <h1> {user.username} </h1>
        <ul className="userDetails">
          <li>Age: {age} </li>
          <li>Name: {fullName}</li>
        </ul>
      </div>
    )
  }
}

export default UserDetails;
