import dispatcher from '../dispatcher';

export default{
  createPost(post){
    dispatcher.dispatch({
      type: "CREATE_POST",
      post
    });
  },
  postComment(comment){
    dispatcher.dispatch({
      type: "POST_COMMENT",
      comment
    });
  },

  deletePost(id){
    dispatcher.dispatch({
      type: "DELETE_POST",
      id
    });
  },

  reloadPosts(){
    dispatcher.dispatch({
      type: "FETCH_NEWS",
      message: "loading..."
    });
  },

  loadComments(post_id){
    dispatcher.dispatch({
      type: "FETCH_COMMENTS",
      message: "loading...",
      post_id
    });
  },
  receiveNews(news){
    dispatcher.dispatch({
      type: "RECEIVE_NEWS",
      news
     });
  },
  receiveComments(comments){
    dispatcher.dispatch({
      type: "RECEIVE_COMMENTS",
      comments
    });
  }
}
