import BaseStore from './BaseStore';

class MessagesStore extends BaseStore{
  constructor(){
    super();
    this._summary = '';
    this._errors = {};
    this.subscribe(() => this._registerToActions.bind(this));
  }

  _registerToActions(action){
    switch(action.type){
      case "BAD_AUTH":
        this._summary = action.errors.summary;
        this._errors = action.errors.errors;
        this.emitChange();
        this.reset();
        break;
      case "SUCCESS":
        this._summary = action.summary;
        this.emitChange();
        this.reset();
        break;
      default:
        break;
    }
  }

  /**
    resets the messages after displaying them
  */
  reset(){
    this._summary = '';
    this._errors = {};
  }

  get summary(){
    return this._summary;
  }

  get errors(){
    return this._errors;
  }
}

export default new MessagesStore();
