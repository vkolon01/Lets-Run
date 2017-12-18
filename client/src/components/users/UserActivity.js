import React, {Component} from 'react';
import Post from '../feed/Post';

class UserActivity extends Component{



  render(){
    let posts = this.props.posts;
    let user = this.props.user;
    if(posts.length > 0){
      var UserPosts = posts.map((post) => {
          return <Post
            key={post._id}
            author={user}
            post = {post}
            handleReload = {this.props.handleReload.bind(this)}
          />
      })
    }

    return (
      <div>
        {UserPosts}
      </div>
    )
  }
}

export default UserActivity;
