import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
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
        password: '',
        dob: new Date()
      }
    };
    this.updateForm = this.updateForm.bind(this);
    this.register = this.register.bind(this);
    this.updateMessages = this.updateMessages.bind(this);
  }
  componentWillMount(){
    MessagesStore.on('change',this.updateMessages);
  }
  componentWillUnmount(){
    MessagesStore.removeListener('change', this.updateMessages);
  }

  updateForm(event,value){
    const user = this.state.user;
    if(event){
      const field = event.target.name;
      user[field] = event.target.value;
    }else{
      user["dob"] = value
    }
    this.setState({
      user
    });
  }

  updateMessages(){
    this.setState({
      summary: MessagesStore.summary,
      errors: MessagesStore.errors
    })
  }
  register(event){
    event.preventDefault();
    AuthService.register(this.state.user);
  }
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
            <DatePicker
              hintText="Date of Birth"
              mode="landscape"
              maxDate={new Date()}
              name="dob"
              errorText = {errors.dob}
              onChange={this.updateForm}
              value={user.dob}
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
