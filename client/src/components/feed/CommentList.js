import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import CommentStore from '../../stores/CommentStore';
import {Link} from 'react-router-dom';
import NewsActions from '../../actions/NewsActions';

class CommentList extends Component{
  constructor(){
    super();
    this.state = {
      comments: CommentStore.comments,
      numberOfComments: 0,
      showComments: false
    }
    this.updateComments = this.updateComments.bind(this);
  }

  componentWillMount(){
    CommentStore.on('change',this.updateComments);
  }
  componentWillUnmount(){
    CommentStore.removeListener('change', this.updateComments);
  }
  componentDidMount(){
    this.setState({
      numberOfComments: this.props.post.comments.length
    })
  }

  toggleComments(){
    if(!this.state.showComments){
      NewsActions.loadComments(this.props.post._id);
    }else{
      this.setState({
        showComments: false
      });
    }
  }
    updateComments(){
      if(CommentStore.comments[0] && this.props.post._id === CommentStore.comments[0].parent_id){
        this.setState({
          comments: CommentStore.comments,
          numberOfComments: CommentStore.comments.length,
          showComments: true
        });
      }
    }
  render(){
    let post = this.props.post;
    let numberOfComments = this.state.numberOfComments;
    let postComments;
    if(this.state.showComments){
      postComments = this.state.comments.map((comment) => {
        return (
          <div key={comment._id} className = "comment">
              <h3 className="comment_author"> <Link to={`/user/${comment.author_id}`}>{comment.author.username}</Link> </h3>
              <p className="comment_message"> {comment.message} </p>            </div>
        )
      })
    };

    if(this.state.comments){
      return(
        <div>
            <div className={this.state.showDetails? "post_comments post_comments--are-open": "post_comments"} onClick={this.toggleComments.bind(this)}>
              {numberOfComments ? numberOfComments + (numberOfComments > 1 ? " comments" : " comment") : ""}
            </div>

            <ReactCSSTransitionGroup transitionName="toggle"
                                    transitionEnterTimeout={250}
                                    transitionLeaveTimeout={50}>
                                    {postComments}
            </ReactCSSTransitionGroup>

        </div>

      )
    }
  }
}

export default CommentList;
