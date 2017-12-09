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
      news: FeedStore.news
    };
    this.getAllPosts = this.getAllPosts.bind(this);
  }
  componentWillMount(){
    FeedStore.on('change', this.getAllPosts);
  }
  componentWillUnmount(){
    FeedStore.removeListener("change",this.getAllPosts);
  }
  componentDidMount(){
    NewsActions.reloadPosts();
  }
  getAllPosts(){
    this.setState({
      news: FeedStore.news
    });
  }

  render(){
    const news = this.state.news;
    var NewsComponents = news.reverse().map((post) => {
      return <Post
        key={post.post._id}
        post = {post}
      />
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
