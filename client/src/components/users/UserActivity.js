import React, {Component} from 'react';
import Post from '../feed/Post';

class UserActivity extends Component{

  render(){
    let posts = this.props.posts;
    let user = this.props.posts.user;
    var UserActivities
    if(posts.length > 0){
      UserActivities = posts.map((post) => {
          return <Post
            key={post._id}
            post = {post}
          />
      })
    }

    return (
      <div>
        {UserActivities}
      </div>
    )
  }
}

export default UserActivity;
