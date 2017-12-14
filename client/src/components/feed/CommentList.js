import React, {Component} from 'react';
import CommentStore from '../../stores/CommentStore';
import NewsActions from '../../actions/NewsActions';
//import Comment from './Comment';

class CommentList extends Component{
  constructor(){
    super();
    this.state = {
      comments: CommentStore.comments
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
    NewsActions.loadComments(this.props.post._id);

  }
  updateComments(){
    this.setState({
      comments: CommentStore.comments
    })
  }
  render(){
    if(this.state.comments){
      console.log(this.state.comments[0].body);
      return(
        this.state.comments.reverse().map((comment) => {
            <div key={comment._id} className = "comment">
              <h3 className="comment_author"> {comment.author} </h3>
              <p className="comment_body"> {comment.body} </p>
            </div>
        })
      )
    }
  }
}

export default CommentList;
