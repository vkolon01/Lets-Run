import React,{Component} from 'react';
import {PropTypes} from 'prop-types';
import NewsActions from '../../actions/NewsActions';
import TextField from 'material-ui/TextField';

class NewComment extends Component{
  componentWillMount(){
    this.setState({
      comment:{
        id: Date.now(),
        body: '',
      }
    });
  }

  handleChange(event){
    const field = event.target.name;
    const comment = this.state.comment;
    comment[field] = event.target.value;
    this.setState({
      comment
    });
  }

  handleSubmit(e){
    e.preventDefault();
    NewsActions.postComment({comment:this.state.comment, post_id: this.props.post_id});
  }

  render(){
    return (
      <div className = "comment_container">
        <form onSubmit={this.handleSubmit.bind(this)}>
          <TextField
                multiLine={true}
                onChange={this.handleChange.bind(this)}
                hintText="Leave a comment"
                name="body"/>
          <button type="submit">Post comment</button>
        </form>
      </div>
    )
  }
}

NewComment.PropTypes = {
  showComments: PropTypes.func,
  cancel: PropTypes.func
}

export default NewComment;
