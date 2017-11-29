import React, {Component} from 'react';
import {Redirect} from 'react-router';
import { Link } from 'react-router-dom';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import when from 'when';
import request  from 'reqwest';
import MessagesStore from '../../stores/MessagesStore';
import AuthService from '../../services/AuthService';

class RegistrationPage extends Component{
  constructor(props){
    super(props);
    this.state = {
      redirect: false,
      summary: MessagesStore.summary,
      errors:  MessagesStore.errors,
      user:{
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: ''
      }
    };
    this.updateForm = this.updateForm.bind(this);
    this.register = this.register.bind(this);
    this.update = this.update.bind(this);
  }
  componentWillMount(){
    MessagesStore.on('change',this.update);
  }
  componentWillUnmount(){
    MessagesStore.removeListener('change', this.update);
  }

  updateForm(event){
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({
      user
    });
  }
  update(){
    this.setState({
      summary: MessagesStore.summary,
      errors: MessagesStore.errors
    })
  }
  register(event){
    event.preventDefault();
    AuthService.register(this.state.user);
  }
    //strings for an HTTP body message
    //encodeURIComponent escapes certain form characters that
    //can be intepreted as part of the code at the server
    /*
    const firstName = encodeURIComponent(this.state.user.firstName);
    const lastName = encodeURIComponent(this.state.user.lastName);
    const username = encodeURIComponent(this.state.user.username);
    const email = encodeURIComponent(this.state.user.email);
    const password = encodeURIComponent(this.state.user.password);
    const formData = `firstName=${firstName}&lastName=${lastName}&username=${username}&email=${email}&password=${password}`;
    console.log(formData);
    //Ajax request
    const xhr = new XMLHttpRequest();
    xhr.open('post','http://localhost:3000/users/register');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load',() => {
      if (xhr.status === 200){
        this.setState({
          errors: {},
          redirect: true
        });
        localStorage.setItem('duccessMessage', xhr.response.message);

      }else{
        const errors = xhr.response.errors ? xhr.response.errors : {};
        errors.summary = xhr.response.message;

        this.setState({
          errors
        });
      }
    });
    xhr.send(formData);
  }
*/
  render(){
    const user = this.state.user;
    const summary = this.state.summary;
    const errors = this.state.errors;
    return(
      <Card className="container">
        <form action='/' onSubmit={this.register}>
          <h2 className="card-heading">Registration</h2>
          <p className="error-message">{summary}</p>
          <div className="field-line">
            <TextField
              floatingLabelText="First name"
              name="firstName"
              errorText = {errors.firstName}
              onChange={this.updateForm}
              value={user.firstName}
            />
          </div>
          <div className="field-line">
            <TextField
              floatingLabelText="Last name"
              name="lastName"
              errorText = {errors.lastName}
              onChange={this.updateForm}
              value={user.lastName}
            />
          </div>
          <div className="field-line">
            <TextField
              floatingLabelText="Username"
              name="username"
              errorText = {errors.username}
              onChange={this.updateForm}
              value={user.username}
            />
          </div>
          <div className="field-line">
            <TextField
              floatingLabelText="Email"
              name="email"
              errorText = {errors.email}
              onChange={this.updateForm}
              value={user.email}
            />
          </div>
          <div className="field-line">
            <TextField
              floatingLabelText="Password"
              type="password"
              name="password"
              errorText = {errors.password}
              onChange={this.updateForm}
              value={user.password}
            />
          </div>
          <div className = "button-line">
            <RaisedButton type="submit" label="Create new account" primary />
          </div>

          <CardText>Already have an account? <Link to={'/sign_in'}>Sign in</Link></CardText>
        </form>
      </Card>
    )
  }
}

export default RegistrationPage;
