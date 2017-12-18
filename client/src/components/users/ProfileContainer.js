import React, {Component} from 'react';
import UserStore from '../../stores/UserStore';
import FeedStore from '../../stores/FeedStore';
import UserActions from '../../actions/UserActions';
import NewsActions from '../../actions/NewsActions';
import UserDetails from './UserDetails';
import UserActivity from './UserActivity';

class ProfileContainer extends Component{

  constructor(){
    super();
    this.state = {
      user : UserStore.user,
      posts : FeedStore.posts
    }
    this.getUserDetails = this.getUserDetails.bind(this);
    this.getPosts = this.getPosts.bind(this);
    this.reloadUserPosts = this.reloadUserPosts.bind(this);
  }

  componentWillMount(){
    UserStore.on('change', this.getUserDetails);
    FeedStore.on('change', this.getPosts);
  }
  componentWillUnmount(){
    UserStore.removeListener("change",this.getUserDetails);
    FeedStore.removeListener("change",this.getPosts);
  }
  componentDidMount(){
    UserActions.fetchUser(this.props.match.params.user_id);
    this.reloadUserPosts()
  }
  getUserDetails(){
    this.setState({
      user: UserStore.user
    })
  }
  getPosts(){
    this.setState({
      posts: FeedStore.posts
    })
  }
  reloadUserPosts(){
    NewsActions.fetchPostsByUserId(this.props.match.params.user_id);
  }

  render(){
    let user_id = this.props.match.params.user_id
    return(
      <div>
        <UserDetails user = {this.state.user}/>
        <UserActivity posts = {this.state.posts} user = {this.state.user} handleReload = {this.reloadUserPosts}/>
      </div>
    )
  }
}

export default ProfileContainer;
