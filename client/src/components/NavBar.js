import React, {Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import {Link} from 'react-router-dom';
import AuthStore from '../stores/AuthStore';
import AuthService from '../services/AuthService';

class NavBar extends Component{

  constructor(){
    super();
    this.state={
      username: AuthStore.username,
      user_id: AuthStore.user_id,
      menuOpen: false
    }
    this.update = this.update.bind(this);
  }
  componentWillMount(){
    AuthStore.on('change',this.update);
  }
  componentWillUnmount(){
    AuthStore.removeListener('change', this.update);
  }
  update(){
    this.setState({
      username: AuthStore.username,
      user_id: AuthStore.user_id
    })
  }

  toggleMenu = (event) =>{
    event.preventDefault();
    this.setState({
      menuOpen: true,
      anchorEl: event.target
    })
  }

  handleRequestClose = () =>{
    this.setState({
      menuOpen:false
    })
  }

  render(){
    const username = this.state.username;
    const summary = this.state.summary;
    const user_id = this.state.user_id;
    return (
      <div className="navbar">
        <div className="logo"><Link to="/">Home</Link></div>
        {summary}
        {AuthStore.isLoggedIn() ? (
          <div className="navbar_auth">
            <RaisedButton
              onClick={this.toggleMenu}
              label={username}
            />
            <Popover
              open={this.state.menuOpen}
              anchorEl={this.state.anchorEl}
              anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'left', vertical: 'top'}}
              onRequestClose={this.handleRequestClose}
            >
              <Menu onClick={this.handleRequestClose}>
                <MenuItem primaryText="My account" containerElement={<Link to={`/user/${user_id}`}/>}/>
                <MenuItem primaryText="Log Out" onClick={AuthService.logout}/>
              </Menu>
            </Popover>
          </div>
        ) : (
          <div className="navbar_auth">
            <RaisedButton
              containerElement={<Link to="/sign_in"/>}
              label={"Sign In"}
            />
            <RaisedButton
              containerElement={<Link to="/register"/>}
              label={"Register"}
            />
          </div>
        )}

        <hr/>
      </div>
    )
  }
}

export default NavBar;
