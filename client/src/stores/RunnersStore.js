import BaseStore from './BaseStore';
import FeedFetcher from '../api/feedFetcher';

class RunnersStore extends BaseStore{
  constructor(){
    super();
    this._runners = [];
    this._event_id = '';
    this.subscribe(() => this._registerToActions.bind(this));
  }

  _registerToActions(action){
    switch(action.type){
      case "FETCH_RUNNERS":
        FeedFetcher.fetchRunners(action.event_id);
        break;
      case "RECEIVE_RUNNERS":
        this._runners = action.runners;
        this._event_id = action.event_id;
        this.emitChange();
        this.reset();
        break;
      case "ATTEND_EVENT":
        FeedFetcher.attendEvent(action.event_id);
        break;
      default:
        break;
    }
  };

  reset(){
    this._runners = [];
  }

  get runners(){
    return this._runners ? this._runners : [];
  }

  get event_id(){
    return this._event_id;
  }
};

export default new RunnersStore();
