import React,{Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import NewComment from './NewComment';
import UserStore from '../../stores/UserStore';
import NewsActions  from '../../actions/NewsActions';
import CommentStore from '../../stores/CommentStore';

class Post extends Component{
  constructor(){
    super(...arguments);
    this.state = {
      showComments: false,
      showCommentInputContainer: false,
      comments: CommentStore.comments
    };
    this.updateComments = this.updateComments.bind(this);
  }

  componentWillMount(){
    CommentStore.on('change',this.updateComments);
  }
  componentWillUnmount(){
    CommentStore.removeListener('change', this.updateComments);
  }

  /*
    If comments are currently non-visible, fetches related comments from the server
    and turns comments visible.
  */
  toggleComments(){
    if(!this.state.showComments){
      NewsActions.loadComments(this.props.post.post._id);
    }else{
      this.setState({
        showComments: false
      });
    }
  }

  loadComments(){
    NewsActions.loadComments(this.props.post.post._id);
  }

  updateComments(){
    if(CommentStore.comments[0] && this.props.post.post._id === CommentStore.comments[0].parent_id){
      this.setState({
        comments: CommentStore.comments,
        showComments: true
      });
    }
  }

  deletePost(){
    NewsActions.deletePost(this.props.post.post._id)
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
      postComments = this.state.comments.map((comment) => {
        return (
          <div key={comment._id} className = "comment">
            <h3 className="comment_author"> {comment.author ? comment.author.username : ""} </h3>
            <p className="comment_message"> {comment.message} </p>
          </div>
        )
      })
    };

    return(
      <div className="post">
        <div className="post_body">
          {UserStore.username === author.username ?
            <div className="remove_post"> <button onClick={this.deletePost.bind(this)}> x </button></div>
          :
            ""
          }
          <div className="post_username"> {author.username} : </div>
          <div className="post_message"> {post.message} </div>
          {this.state.showCommentInputContainer ?
            <NewComment
              cancel = {this.toggleCommentInputContainer.bind(this)}
              showComments = {this.loadComments.bind(this)}
              post_id = {post_id}
            />
          :
            <div className="leave_comment" onClick={this.toggleCommentInputContainer.bind(this)}> Leave comment</div>
          }

          <div className={this.state.showDetails? "post_comments post_comments--are-open": "post_comments"} onClick={this.toggleComments.bind(this)}>
            {post.comments && post.comments.length ? post.comments.length + (post.comments.length > 1 ? " comments" : " comment") : ""}
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
