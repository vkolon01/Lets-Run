import React, {Component} from 'react';
import moment from 'moment';
import {Link} from 'react-router-dom';
import {ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

class UserDetails extends Component{

  render(){
    const user = this.props.user;
    const age =  moment().diff(user.dob, 'years')
    const fullName = user.firstName + ' ' + user.lastName;
    return (
      <div>
        <ListItem leftAvatar={<Avatar size={50}>{user.username.charAt(0)}</Avatar>} containerElement={<Link to={`/user/${user._id}`}/>}>
          {user.username}
        </ListItem>
        <ul className="userDetails">
          <li>Age: {age} </li>
          <li>Name: {fullName}</li>
        </ul>
      </div>
    )
  }
}

export default UserDetails;
