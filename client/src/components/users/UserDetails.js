import React, {Component} from 'react';
import moment from 'moment';

class UserDetails extends Component{

  render(){
    const user = this.props.user;
    const age =  moment().diff(user.dob, 'years')
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
