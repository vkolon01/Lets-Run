import BaseStore from './BaseStore';
import FeedFetcher from '../api/feedFetcher';

class UserStore  extends BaseStore{
  constructor(){
    super();
    this._user = "";
    this.subscribe(() => this._registerToActions.bind(this))
}
  _registerToActions(action){
    switch(action.type){
      case "FETCH_USER":
        FeedFetcher.fetchUser(action.user_id);
        break;
      case "RECEIVE_USER":
        this._user = action.user;
        this.emitChange();
        break;
      default:
        break;
    }
  }

  get user(){
    return this._user ? this._user : "";
  }
}

export default new UserStore();
