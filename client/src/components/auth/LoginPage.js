import React, {Component} from 'react';
import {Redirect} from 'react-router';
import { Link } from 'react-router-dom';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
//import LoginActions from '../../actions/LoginActions';
import MessagesStore from '../../stores/MessagesStore';
import AuthService from '../../services/AuthService';

class LoginPage extends Component{
  constructor(props){
    super(props);
    this.state = {
      errors:  MessagesStore.errors,
      summary: MessagesStore.summary,
      redirect: false,
      successMessage:'',
      user:{
        email: '',
        password: ''
      }
    };
    this.updateErrors = this.updateErrors.bind(this);
  }
  componentWillMount(){
    MessagesStore.on('change',this.updateErrors);
  }
  componentWillUnmount(){
    MessagesStore.removeListener('change', this.updateErrors);
  }

  login(event){
    event.preventDefault();
    AuthService.login(this.state.user);
  }

  updateForm(event){
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;
    this.setState({
      user
    });
  }
  updateErrors(){
    this.setState({
      summary: MessagesStore.summary,
      errors: MessagesStore.errors
    })
  }
  render(){
    const summary = this.state.summary;
    const redirect = this.state.redirect;
    if(redirect){
      return <Redirect to = '/'/>;
    }
    return(
      <Card className="container">
        <form onSubmit={this.login.bind(this)}>
          <h2 className="card-heading">Login</h2>
          <p className="error-message">{summary}</p>
          <div className="field-line">
            <TextField
              floatingLabelText="Email"
              onChange={this.updateForm.bind(this)}
              type="email"
              name="email"
              value={this.state.user.email}
            />
          </div>
          <div className="field-line">
            <TextField
              floatingLabelText="Password"
              onChange={this.updateForm.bind(this)}
              type="password"
              name="password"
              value={this.state.user.password}
            />
          </div>

          <div className="button-line">
            <RaisedButton type="submit" label="Log in" primary />
          </div>

          <CardText>Dont have an account? <Link to={'/register'}>Create one</Link>.</CardText>
        </form>
      </Card>
    )
  }
}

export default LoginPage;
