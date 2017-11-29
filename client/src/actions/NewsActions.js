import dispatcher from '../dispatcher';

export default{
  createPost(post){
    dispatcher.dispatch({
      type: "CREATE_POST",
      post
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
  receiveNews(news){
    dispatcher.dispatch({
      type: "RECEIVE_NEWS",
      news
     });
  }
}
