import React, {Component} from 'react';
import 'whatwg-fetch';
import FeedStore from '../../stores/FeedStore';
import Post from './Post';
import NewPost from './NewPost';
import NewsActions from '../../actions/NewsActions';

class FeedContainer extends Component{
  constructor(){
    super();
    this.state = {
      news: FeedStore.posts
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
      news: FeedStore.posts
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
      }
    })
    return(
      <div>
        <div className="action">
          <NewPost/>
        </div>
        <div className="newsfeed">

          <button onClick={NewsActions.reloadPosts}> Refresh Posts </button>

            {NewsComponents}

        </div>
      </div>

    )
  }
}

export default FeedContainer;
