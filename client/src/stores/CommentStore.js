import BaseStore from './BaseStore';
import FeedFetcher from '../api/feedFetcher';

class CommentStore extends BaseStore{
  constructor(){
    super();
    this._comments = [];
    this.subscribe(() => this._registerToActions.bind(this));
  }

  _registerToActions(action){
    switch(action.type){
      case "FETCH_COMMENTS":
        FeedFetcher.fetchComments(action.post_id);
        break;
      case "RECEIVE_COMMENTS":
        this._comments = action.comments;
        this.emitChange();
        this.reset();
        break;
      default:
        break;
    }
  };

  reset(){
    this._comments = [];
  }

  get comments(){
    return this._comments ? this._comments : [];
  }
};

export default new CommentStore();
