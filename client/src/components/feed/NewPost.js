import React,{Component} from 'react';
import NewsActions from '../../actions/NewsActions';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import NewEvent from './NewEvent';

class NewPost extends Component{
  constructor(){
    super();
    this.state = {
      post:{
        id: Date.now(),
        message: '',
      },
      event: null,
      showEventAttachment: false,
      maxNumOfCharacters: 100,
      submitDisabled: true
    };
  }

  handleChange(event){
    const field = event.target.name;
    const post = this.state.post;
    post[field] = event.target.value.length <= this.state.maxNumOfCharacters ? event.target.value : this.state.post.message;
    this.setState({
      post,
      charactersRemaining: this.state.charactersRemaining - post[field].length
    });
  }

  toggleEventAttachment(){
    this.setState({
      showEventAttachment: !this.state.showEventAttachment
    })
  }

  handleSubmit(e){
    e.preventDefault();
    NewsActions.createPost({post:this.state.post, event: null});
  }

  render(){
    let charactersRemaining = this.state.maxNumOfCharacters - this.state.post.message.length
    return(
      <div>
        <div className = "new post">
              <TextField
                      onChange={this.handleChange.bind(this)}
                      floatingLabelText={`Write your ideas here: ${charactersRemaining} characters remaining`}
                      name="message"
                      value={this.state.post.message}
                      multiLine={true}
                      rows={2}
                      rowsMax={4}/>

              <NewEvent
                      post={this.state.post}
                      showEventAttachment={this.state.showEventAttachment}
                      handleCancel={this.toggleEventAttachment.bind(this)}/>
              {!this.state.showEventAttachment ?
              <div>
                <FlatButton label="Attach Event" onClick={this.toggleEventAttachment.bind(this)}/>
                <FlatButton label="Submit Post" disabled={this.state.submitDisabled} primary={true} onClick={this.handleSubmit.bind(this)}/>
              </div> : ""}
        </div>
      </div>
    )
  }
};

export default NewPost;
