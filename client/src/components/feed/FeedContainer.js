import React, {Component} from 'react';
import 'whatwg-fetch';
import FeedStore from '../../stores/FeedStore';
import Post from './Post';
import NewPost from './NewPost';
import NewsActions from '../../actions/NewsActions';
import CircularProgress from 'material-ui/CircularProgress';

class FeedContainer extends Component{
  constructor(){
    super();
    this.state = {
      news: FeedStore.posts,
      loading: true
    };
    this.getAllPosts = this.getAllPosts.bind(this);
    this.reloadPosts = this.reloadPosts.bind(this);
  }
  componentWillMount(){
    FeedStore.on('change', this.getAllPosts);
  }
  componentWillUnmount(){
    FeedStore.removeListener("change",this.getAllPosts);
  }
  componentDidMount(){
    this.reloadPosts();
  }
  getAllPosts(){
    this.setState({
      news: FeedStore.posts,
      loading: false
    });
  }
  reloadPosts(){
    NewsActions.fetchPosts();
  }

  render(){
    const news = this.state.news;
    var NewsComponents = news.map((post) => {
      if(post.user){
        return <Post
          key={post.post._id}
          author = {post.user}
          post = {post.post}
          handleReload = {this.reloadPosts}
        />
      }else{
        return ""
      }
    })
    return(
      <div>
        <div className="action">
          <NewPost/>
        </div>
        <div className="newsfeed">
          {this.state.loading ? <CircularProgress /> : ""}
          {NewsComponents}
        </div>
      </div>

    )
  }
}

export default FeedContainer;
