import React,{Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import NewComment from './NewComment';

class Post extends Component{
  constructor(){
    super(...arguments);
    this.state = {
      showComments: false,
      showCommentInputContainer: false
    };
  }

  toggleComments(){
    this.setState({
      showComments: !this.state.showComments,
    })
  }
  showComments(){
    if(!this.state.showComments) this.toggleComments();
  }

  toggleCommentInputContainer(){
    this.setState({
      showCommentInputContainer: !this.state.showCommentInputContainer,
    })
  }
  render(){
    let author = this.props.post.user;
    let post = this.props.post.post;
    let post_id = post._id;
    let postComments;

    if(this.state.showComments){
      postComments = post.comments.reverse().map((comment) => {
        return (
          <div key={comment._id} className = "comment">
            <h3 className="comment_author"> {comment.author} </h3>
            <p className="comment_body"> {comment.body} </p>
          </div>
        )
      })
    };

    return(
      <div className="post">
        <div className="post_body">
          <div className="post_username"> {author.username} : </div>
          <div className="post_message"> {post.message} </div>


          {this.state.showCommentInputContainer ?
            <NewComment
              cancel = {this.toggleCommentInputContainer.bind(this)}
              showComments = {this.showComments.bind(this)}
              post_id = {post_id}
            />
            :
            <div className="leave_comment" onClick={this.toggleCommentInputContainer.bind(this)}> Leave comment</div>
          }

          <div className={this.state.showDetails? "post_comments post_comments--are-open": "post_comments"} onClick={this.toggleComments.bind(this)}>
            {post.comments.length ? post.comments.length + (post.comments.length > 1 ? " comments" : " comment") : ""}
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
