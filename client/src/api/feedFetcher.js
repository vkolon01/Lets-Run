import React, {Component} from 'react';
import 'whatwg-fetch';
import {Redirect} from 'react-router-dom';
import NewsActions from '../actions/NewsActions';
import MessageActions from '../actions/MessageActions';
import LoginStore from '../stores/LoginStore';
import when from 'when';
import request  from 'reqwest';

const API_URL = 'http://localhost:3000/';
const API_HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': "nothing yet"
};

class FeedFetcher{
      fetchNews(){
        return when(request({
          url: 'http://localhost:3000/',
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

      sendNews(post){
        return when(request({
          url: 'http://localhost:3000/newpost',
          method: 'POST',
          crossOrigin: true,
          contentType: "application/json",
          data: post,
          headers:{
            'Content-Type': 'application/x-www-form-urlencoded',
            'authorization': 'JWT ' + LoginStore.jwt
          },
          error: function(err){
            if(err.status === 404){
              MessageActions.displayErrors(JSON.parse(err.response));
            }
          },
          success: function(res){
            NewsActions.reloadPosts();
          }
        }));
      }
}

export default new FeedFetcher();
