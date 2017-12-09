import React,{Component} from 'react';
import NewsActions from '../../actions/NewsActions';

class NewPost extends Component{
  componentWillMount(){
    this.setState({
      post:{
        id: Date.now(),
        message: '',
        comments: []
      }
    });
  }

  handleChange(event){
    const field = event.target.name;
    const post = this.state.post;
    post[field] = event.target.value;
    this.setState({
      post
    });
  }

  handleSubmit(e){
    e.preventDefault();
    NewsActions.createPost({post:this.state.post, event: null});
  }

  render(){
    return(
      <div>
        <div className = "new post">
          <form onSubmit={this.handleSubmit.bind(this)}>
            <textarea
                    value={this.state.message}
                    onChange={this.handleChange.bind(this)}
                    placeholder="Write your thoughts here"
                    name="message"
                    required={true}/>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    )
  }
};

export default NewPost;
