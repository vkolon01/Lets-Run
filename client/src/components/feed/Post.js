import React,{Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Post extends Component{
  constructor(){
    super(...arguments);
    this.state = {
      showComments: false
    };
  }

  toggleComments(){
    this.setState({showComments: !this.state.showComments})
  }

  render(){
    let post = this.props.post;
    let postComments;
    if(this.state.showComments){
      postComments = (
        <div className = "comment">
          <h3> author </h3>
          <p> comment </p>
        </div>
      )
    }

    return(
      <div className="post">
        <div className={this.state.showComments ? "hide comments" : "show comments"} onClick={this.toggleComments.bind(this)}>
          {post.author }
          {post.message}
        </div>
          <ReactCSSTransitionGroup transitionName="toggle"
                                  transitionEnterTimeout={250}
                                  transitionLeaveTimeout={50}>
              {postComments}
          </ReactCSSTransitionGroup>
      </div>
      //card comments later
    )
  }
}

export default Post;
