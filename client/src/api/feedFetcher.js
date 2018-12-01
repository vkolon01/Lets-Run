import 'whatwg-fetch';
import NewsActions from '../actions/NewsActions';
import MessageActions from '../actions/MessageActions';
import UserActions from '../actions/UserActions';
import AuthStore from '../stores/AuthStore';
import when from 'when';
import request  from 'reqwest';
import constants from '../constants/constants';
import History from '../services/History';

const API_URL = constants.SEVER_URL;
/*
const API_HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': "nothing yet"
};
*/

class FeedFetcher{
      fetchPosts(){
        return when(request({
          url: API_URL,
          method: 'GET',
          crossOrigin: true,
          // headers: {
            
          // },
          contentType: "application/json",
          error: function(err){
            if(err.status === 404){
              MessageActions.displayErrors(JSON.parse(err.response));
            }
          },
          success: function(res){
            NewsActions.receivePosts(res);
          }
        }));
      }
      fetchPostsByUserId(user_id){
        return when(request({
          url: API_URL + "/users/" + user_id + "/posts",
          method: 'GET',
          crossOrigin: true,
          contentType: "application/json",
          error: function(err){
            if(err.status === 404){
              MessageActions.displayErrors(JSON.parse(err.response));
            }
          },
          success: function(res){
            NewsActions.receivePosts(res);
          }
        }));
      }
      createPost(post){
        return when(request({
          url: API_URL + '/newpost',
          method: 'POST',
          crossOrigin: true,
          contentType: "application/json",
          data: post,
          headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
            'authorization': 'JWT ' + AuthStore.jwt
          },
          error: function(err){
            if(err.status === 404){
              MessageActions.displayErrors(JSON.parse(err.response));
            }
            if(err.status === 401){
              History.replace('/sign_in');
              MessageActions.displayErrors(JSON.parse(err.response));
            }
          },
          success: function(res){
            NewsActions.fetchPosts();
          }
        }));
      }
      deletePost(post_id){
        return when(request({
          url: API_URL + '/posts/' + post_id,
          method: 'DELETE',
          crossOrigin: true,
          contentType: "application/json",
          headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
            'authorization': 'JWT ' + AuthStore.jwt
          },
          error: function(err){
              MessageActions.displayErrors(JSON.parse(err.response));
          },
          success: function(res){
            NewsActions.fetchPosts();
            MessageActions.displayMessage(res);
          }
        }));
      }

      postComment(data){
        return when(request({
          url: API_URL + '/newcomment',
          method: 'POST',
          crossOrigin: true,
          contentType: "application/json",
          data: data,
          headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
            'authorization': 'JWT ' + AuthStore.jwt
          },
          error: function(err){
            if(err.status === 404){
              MessageActions.displayErrors(err.response);
            }
            if(err.status === 401){
              History.replace('/sign_in');
              MessageActions.displayErrors(JSON.parse(err.response));
            }
          },
          success: function(res){
            NewsActions.loadComments(data.post_id)
            MessageActions.displayMessage(res);
          }
        }));
      }

      fetchComments(post_id){
        return when(request({
          url: API_URL + '/posts/' + post_id,
          method: 'GET',
          crossOrigin: true,
          contentType: "application/json",
          error: function(err){
            if(err.status === 404){
              MessageActions.displayErrors(JSON.parse(err.response));
            }
          },
          success: function(res){
            NewsActions.receiveComments(res,post_id);
          }
        }));
      }
      likePost(post_id){
        return when(request({
          url: API_URL + '/posts/' + post_id,
          method: 'PUT',
          crossOrigin: true,
          headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
            'authorization': 'JWT ' + AuthStore.jwt
          },
          contentType: "application/json",
          error: function(err){
            if(err.status === 401){
              MessageActions.displayErrors(JSON.parse(err.response));
            }
          }
        }));
      }

      attendEvent(event_id){
        return when(request({
          url: API_URL + '/events/' + event_id,
          method: 'PUT',
          crossOrigin: true,
          headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
            'authorization': 'JWT ' + AuthStore.jwt
          },
          contentType: "application/json",
          error: function(err){
            if(err.status === 401){
              MessageActions.displayErrors(JSON.parse(err.response));
            }
          },
          success: function(res){
            NewsActions.fetchRunners(event_id);
            MessageActions.displayMessage(res);
          }
        }));
      }

      fetchUser(user_id){
        return when(request({
          url: API_URL + '/users/' + user_id,
          method: 'GET',
          crossOrigin: true,
          contentType: "application/json",
          error: function(err){
            if(err.status === 404){
              MessageActions.displayErrors(err.response);
            }
          },
          success: function(res){
            UserActions.receiveUser(res);
          }
        }));
      }
      fetchRunners(event_id){
        return when(request({
          url: API_URL + '/events/' + event_id,
          method: 'GET',
          crossOrigin: true,
          contentType: "application/json",
          error: function(err){
            if(err.status === 404){
              MessageActions.displayErrors(err.response);
            }
          },
          success: function(res){
            NewsActions.receiveRunners(res,event_id);
          }
        }));
      }
}

export default new FeedFetcher();
