import LoginActions from '../actions/LoginActions';
import MessageActions from '../actions/MessageActions';
import when from 'when';
import request  from 'reqwest';

class AuthService{

  register(form){
    return when(request({
      url: 'http://localhost:3000/users/register',
      method: 'POST',
      crossOrigin: true,
      type: 'json',
      contentType: "application/json",
      data: form,
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      error: function(err){
        if(err.status === 404){
          MessageActions.displayErrors(JSON.parse(err.response));
        }
      },
      success: function(res){
        MessageActions.displayMessage(res.message);
      }
    }));
  }

  login(form){
    return when(request({
      url: 'http://localhost:3000/users/sign_in',
      method: 'POST',
      crossOrigin: true,
      type: 'json',
      contentType: "application/json",
      data: form,
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      error: function(err){
        if(err.status === 404){
          MessageActions.displayErrors(JSON.parse(err.response));
          //alert(JSON.parse(err.response).message);
        }
      },
      success: function(res){
        var jwt = res.token;
        LoginActions.loginUser(jwt);
        MessageActions.displayMessage(res.message);
      }
    }));
  }

  logout(){
    LoginActions.logoutUser();
    MessageActions.displayMessage('You logged out successfully');
  }
}

export default new AuthService();
