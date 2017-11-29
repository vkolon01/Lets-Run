import React, {Component} from 'react';
import MessagesStore from '../stores/MessagesStore';

class Messages extends Component{
  constructor(){
    super();
    this.state = {
      summary: MessagesStore.summary,
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
      summary:MessagesStore.summary
    })
  }
  render(){
    const messages = this.state.summary
    return(
      <p className="messages">{messages}</p>
    )
  }
}

export default Messages;
