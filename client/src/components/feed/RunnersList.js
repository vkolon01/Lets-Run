import React, {Component} from 'react';
import RunnersStore from '../../stores/RunnersStore';
import NewsActions from '../../actions/NewsActions';
import CircularProgress from 'material-ui/CircularProgress';
import {Link} from 'react-router-dom';
import {ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

class RunnersList extends Component{

  constructor(){
    super();
    this.state ={
      runners: RunnersStore.runners,
      showRunners: false,
      numberOfRunners: 0,
      loading: false
    }
    this.updateRunners = this.updateRunners.bind(this)
  }

  componentWillMount(){
    RunnersStore.on('change',this.updateRunners);
  }

  componentWillUnmount(){
    RunnersStore.removeListener('change', this.updateRunners);
  }

  componentDidMount(){
    this.setState({
      numberOfRunners: this.props.event ? this.props.event.runners.length : 0
    })
  }

  toggleRunners(){
    if(!this.state.showRunners){
      NewsActions.fetchRunners(this.props.post.attachedEvent);
      this.setState({
        showRunners:true,
        loading: true
      })
    }else{
      this.setState({
        showRunners: false,
        loading: false
      });
    }
  }
  updateRunners(){
    if(RunnersStore.event_id === this.props.post.attachedEvent){
      this.setState({
        runners: RunnersStore.runners,
        numberOfRunners: RunnersStore.runners.length,
        loading: false
      })
      this.props.getRunners(RunnersStore.runners.length)
    }
  }

  render(){
    let numberOfRunners = this.state.numberOfRunners;
    if(this.state.showRunners){
      var runners = this.state.runners.map((user) => {
        return (
          <div key={user._id}>
            <ListItem leftAvatar={<Avatar size={30}>{user.username.charAt(0)}</Avatar>}
            containerElement={<Link to={`/user/${user._id}`}/>}
            primaryText={user.firstName + " " + user.lastName}
            />
          </div>
        )
      })
    }

    return(
      <div>
      <div className="showRunners" onClick={this.toggleRunners.bind(this)}>
        {numberOfRunners ? numberOfRunners + (numberOfRunners > 1 ? " runners" : " runner") : ""}
      </div>
        {runners}
        {this.state.loading ? <CircularProgress /> : ""}
      </div>
    )
  }
}

export default RunnersList;
