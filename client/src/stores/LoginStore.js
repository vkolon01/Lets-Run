import dispatcher from '../dispatcher';
import BaseStore from './BaseStore';
import jwt_decode from 'jwt-decode';
import history from '../services/History';

class LoginStore extends BaseStore{
  constructor(){
    super();
    this.subscribe(() => this._registerToActions.bind(this))
    this._user = null;
    this._jwt = null;
  }

  _registerToActions(action){
    switch(action.type){
      case "LOGIN_USER":
        this._jwt = action.jwt;
        this._user = jwt_decode(this._jwt);
        localStorage.setItem('jwt', this._jwt);
        this.emitChange();
        break;
      case "LOGOUT_USER":
        this._user = null;
        this._jwt = null;
        localStorage.removeItem('jwt');
        this.emitChange();
        history.replace('/')
        break;
      default:
        break;
    };
  }

  get username(){
      return this._user ? this._user.username : null
  }

  get jwt(){
    return this._jwt;
  }

  isLoggedIn(){
    return !!this._user;
  }
}

export default new LoginStore();
