import React, {Component} from 'react';
import UserStore from '../../stores/UserStore';
import FeedStore from '../../stores/FeedStore';
import UserActions from '../../actions/UserActions';
import NewsActions from '../../actions/NewsActions';
import UserDetails from './UserDetails';
import UserActivity from './UserActivity';
import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper'
import Divider from 'material-ui/Divider'

class ProfileContainer extends Component{

  constructor(){
    super();
    this.state = {
      user : UserStore.user,
      posts : FeedStore.posts,
      userLoading : true,
      postsLoading : true
    }
    this.getUserDetails = this.getUserDetails.bind(this);
    this.getPosts = this.getPosts.bind(this);
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
    NewsActions.fetchPostsByUserId(this.props.match.params.user_id);
  }
  getUserDetails(){
    this.setState({
      user: UserStore.user,
      userLoading: false
    })
  }
  getPosts(){
    this.setState({
      posts: FeedStore.posts,
      postsLoading: false
    })
  }

  render(){
    return(
      <div>
        <Paper>
          <div className="userDetails">
            {this.state.userLoading ? <CircularProgress /> : ""}
            {this.state.user ?
              <UserDetails user = {this.state.user}/>
            :
              ""
            }
          </div>
          <Divider/>
          <div className="userPosts">
            {this.state.postsLoading ? <CircularProgress size={80}/> : ""}
            {this.state.posts ?
              <UserActivity posts = {this.state.posts}/>
            :
              ""
            }
          </div>
        </Paper>
      </div>
    )
  }
}

export default ProfileContainer;
