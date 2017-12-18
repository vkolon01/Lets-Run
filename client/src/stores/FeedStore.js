import BaseStore from './BaseStore';
import FeedFetcher from '../api/feedFetcher';

class FeedStore  extends BaseStore{
  constructor(){
    super();
    this._posts = [];
    this.subscribe(() => this._registerToActions.bind(this))
}
  createPost(post){
    FeedFetcher.createPost(post);
    this.emitChange();
  }
  deletePost(post_id){
    FeedFetcher.deletePost(post_id);
    this.emitChange();
  }
  postComment(comment){
    FeedFetcher.postComment(comment);
    this.emitChange();
  }
  likePost(post_id){
    FeedFetcher.likePost(post_id);
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
        this.deletePost(action.id);
        break;
      case "LIKE_POST":
        this.likePost(action.id);
        break;
      case "FETCH_POSTS":
        FeedFetcher.fetchPosts();
        break;
      case "FETCH_POSTS_BY_USER_ID":
        FeedFetcher.fetchPostsByUserId(action.user_id);
        break;
      case "RECEIVE_POSTS":
        this._posts = action.posts;
        this.emitChange();
        break;
      default:
        break;
    }
  }

  get posts(){
    return this._posts ? this._posts : [];
  }
}

export default new FeedStore();
