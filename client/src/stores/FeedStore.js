import BaseStore from './BaseStore';
import FeedFetcher from '../api/feedFetcher';

class FeedStore  extends BaseStore{
  constructor(){
    super();
    this._news = [];
    this.subscribe(() => this._registerToActions.bind(this))
}
  createPost(post){
    FeedFetcher.createPost(post);
    this.emit('change');
  }
  postComment(comment){
    FeedFetcher.postComment(comment);
    this.emit('change');
  }
  _registerToActions(action){
    switch(action.type){
      case "CREATE_POST":
        this.createPost(action.post);
        break;
      case "POST_COMMENT":
        this.postComment(action.comment);
        break;
      case "DELETE_POST":
        break;
      case "FETCH_NEWS":
        FeedFetcher.fetchNews();
        break;
      case "RECEIVE_NEWS":
        this._news = action.news;
        this.emit('change');
        break;
      default:
        break;
    }
  }

  get news(){
    return this._news ? this._news : [];
  }
}

export default new FeedStore();
