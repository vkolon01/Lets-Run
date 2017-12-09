import LoginActions from '../actions/LoginActions';
import MessageActions from '../actions/MessageActions';
import when from 'when';
import request  from 'reqwest';
import constants from '../constants/constants';
import History from './History';

const API_URL = constants.SEVER_URL;
const API_HEADERS = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

class AuthService{

  register(form){
    return when(request({
      url: API_URL + '/users/register',
      method: 'POST',
      crossOrigin: true,
      type: 'json',
      contentType: "application/json",
      data: form,
      headers: API_HEADERS,
      error: function(err){
        if(err.status === 404){
          MessageActions.displayErrors(JSON.parse(err.response));
        }
      },
      success: function(res){
        MessageActions.displayMessage(res.message);
        History.replace('/');
      }
    }));
  }

  login(form){
    return when(request({
      url: API_URL + '/users/sign_in',
      method: 'POST',
      crossOrigin: true,
      type: 'json',
      contentType: "application/json",
      data: form,
      headers: API_HEADERS,
      error: function(err){
        if(err.status === 404){
          MessageActions.displayErrors(JSON.parse(err.response));
        }
      },
      success: function(res){
        var jwt = res.token;
        LoginActions.loginUser(jwt);
        MessageActions.displayMessage(res.message);
        History.replace('/');
      }
    }));
  }

  logout(){
    LoginActions.logoutUser();
    MessageActions.displayMessage('You logged out successfully');
  }
}

export default new AuthService();
