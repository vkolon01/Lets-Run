import React, {Component} from 'react';
import MessagesStore from '../stores/MessagesStore';

/**
  The Messages component is used to display a message to the user once
*/
class Messages extends Component{
  constructor(){
    super();
    this.state = {
      summary: MessagesStore.summary,
      error: MessagesStore.error
    };
    this.updateMessages = this.updateMessages.bind(this);
  }
  componentWillMount(){
    MessagesStore.on('change',this.updateMessages);
  }
  componentWillUnmount(){
    MessagesStore.removeListener('change', this.updateMessages);
  }
  updateMessages(){
    this.setState({
      summary:MessagesStore.summary,
      error: MessagesStore.error
    })
  }
  render(){
    const messages = this.state.summary
    const error = this.state.error
    return(
      <div>
        {messages ? <p className="messages">{messages}</p> : ""}
        {error ? <p className="error">{error}</p> : ""}
      </div>
    )
  }
}

export default Messages;
