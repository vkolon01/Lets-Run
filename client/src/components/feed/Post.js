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
    let author = this.props.post.user;
    let post = this.props.post.post;
    let postComments;

    if(this.state.showComments){
      postComments = post.comments.map((comment) => {
        return (
          <div key={comment._id} className = "comment">
            <h3 className="comment_author"> {comment.author} </h3>
            <p className="comment_body"> {comment.body} </p>
          </div>
        )
      })
    }

    return(
      <div className="post">
        <div className="post_body">
          <div className="post_username"> {author.username} : </div>
          <div className="post_message"> {post.message} </div>
          <div className={this.state.showDetails? "post_comments post_comments--are-open": "post_comments"} onClick={this.toggleComments.bind(this)}>
            Show comments
          </div>
        </div>
        <div className="post_comments_section">
          <ReactCSSTransitionGroup transitionName="toggle"
                                  transitionEnterTimeout={250}
                                  transitionLeaveTimeout={50}>
                                  {postComments}
          </ReactCSSTransitionGroup>
        </div>
      </div>
    )
  }
}

export default Post;
