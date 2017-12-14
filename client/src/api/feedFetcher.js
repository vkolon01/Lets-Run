import React, {Component} from 'react';
import 'whatwg-fetch';
import {Redirect} from 'react-router-dom';
import NewsActions from '../actions/NewsActions';
import MessageActions from '../actions/MessageActions';
import UserStore from '../stores/UserStore';
import when from 'when';
import request  from 'reqwest';
import constants from '../constants/constants';
import History from '../services/History';

const API_URL = constants.SEVER_URL;
const API_HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': "nothing yet"
};

class FeedFetcher{
      fetchNews(){
        return when(request({
          url: API_URL,
          method: 'GET',
          crossOrigin: true,
          contentType: "application/json",
          error: function(err){
            if(err.status === 404){
              MessageActions.displayErrors(JSON.parse(err.response));
            }
          },
          success: function(res){
            NewsActions.receiveNews(res);
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
            'authorization': 'JWT ' + UserStore.jwt
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
            NewsActions.reloadPosts();
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
            'authorization': 'JWT ' + UserStore.jwt
          },
          error: function(err){
              MessageActions.displayErrors(JSON.parse(err.response));
          },
          success: function(res){
            NewsActions.reloadPosts();
            MessageActions.displayMessage(res);
          }
        }));
      }

      postComment(comment){
        return when(request({
          url: API_URL + '/newcomment',
          method: 'POST',
          crossOrigin: true,
          contentType: "application/json",
          data: comment,
          headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
            'authorization': 'JWT ' + UserStore.jwt
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
            MessageActions.displayMessage(res);
            NewsActions.reloadPosts();
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
}

export default new FeedFetcher();
