import React,{Component} from 'react';

class Comment extends Component{

  constructor(){
    super();
    this.state = {
      comments = []
    }
  }

  if(this.state.showComments){
    postComments = post.comments.map((comment) => {
      return (
        <div key={comment._id} className = "comment">
          <h3 className="comment_author"> {comment.author_id} </h3>
          <p className="comment_body"> {comment.body} </p>
        </div>
      )
    })
  }

}
