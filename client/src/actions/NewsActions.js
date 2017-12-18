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

  likePost(id){
    dispatcher.dispatch({
      type: "LIKE_POST",
      id
    })
  },

  fetchPosts(){
    dispatcher.dispatch({
      type: "FETCH_POSTS",
    });
  },

  fetchPostsByUserId(user_id){
    dispatcher.dispatch({
      type: "FETCH_POSTS_BY_USER_ID",
      user_id
    })
  },

  loadComments(post_id){
    dispatcher.dispatch({
      type: "FETCH_COMMENTS",
      message: "loading...",
      post_id
    });
  },
  receivePosts(posts){
    dispatcher.dispatch({
      type: "RECEIVE_POSTS",
      posts
     });
  },
  receiveComments(comments){
    dispatcher.dispatch({
      type: "RECEIVE_COMMENTS",
      comments
    });
  }
}
