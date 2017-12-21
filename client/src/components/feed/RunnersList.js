import React, {Component} from 'react';
import RunnersStore from '../../stores/RunnersStore';
import NewsActions from '../../actions/NewsActions';
import Divider from 'material-ui/Divider';

class RunnersList extends Component{

  constructor(){
    super();
    this.state ={
      runners: RunnersStore.runners,
      showRunners: false,
      numberOfRunners: 0
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
        showRunners:true
      })
    }else{
      this.setState({
        showRunners: false
      });
    }
  }
  updateRunners(){
    if(RunnersStore.event_id === this.props.post.attachedEvent){
      this.setState({
        runners: RunnersStore.runners,
        numberOfRunners: RunnersStore.runners.length
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
            {user.firstName + " " + user.lastName}
            <Divider/>
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
      </div>
    )
  }
}

export default RunnersList;
