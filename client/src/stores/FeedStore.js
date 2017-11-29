import BaseStore from './BaseStore';
import dispatcher from '../dispatcher';
import FeedFetcher from '../api/feedFetcher';
import MessageActions from '../actions/MessageActions';

class FeedStore  extends BaseStore{
  constructor(){
    super();
    this._news = [];
    this.subscribe(() => this._registerToActions.bind(this))
}
  createPost(post){
    const id = post.id;
    FeedFetcher.sendNews(post);
    this.emit('change');
  }

  _registerToActions(action){
    switch(action.type){
      case "CREATE_POST":
        this.createPost(action.post);
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
