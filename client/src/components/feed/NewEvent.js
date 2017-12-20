import React,{Component} from 'react';
import NewsActions from '../../actions/NewsActions';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import moment from 'moment';

const distanceOptions = [];
for (let i = 0; i < 100; i++ ) {
  distanceOptions.push(<MenuItem value={i} key={i} primaryText={`${i} Km`} />);
}


class NewEvent extends Component{
  constructor(){
    super();
    this.state={
      distance : 1,
      eventDate: moment()
    }
  }

  changeDistance = (event,index,distance) =>{
    this.setState({
      distance
    })
  }

  changeDate = (event,date) => {
    let year = moment(date).year()
    let month = moment(date).month()
    let day = moment(date).date()
    this.setState({
      eventDate: this.state.eventDate.set({'date':day,'month':month, "year": year})
    })
  }

  changeTime = (event,time) => {
    let hour = moment(time).hour()
    let minute = moment(time).minute()
    this.setState({
      eventDate: this.state.eventDate.set({'hour':hour,'minute':minute})
    })
  }

  handleSubmit(){
    NewsActions.createPost({
      post:this.props.post,
      event:this.state
    })
  }

  render(){
    if(!this.props.showEventAttachment){
      return null;
    }
    return(
      <div className="newEvent-backdrop">
        <div className="newEvent">
          {/* Distance selection */}
          <SelectField
            floatingLabelText="Target Distance"
            value={this.state.distance}
            onChange={this.changeDistance}
          >
            {distanceOptions}
          </SelectField>

          {/* Date and Time selection */}
          <DatePicker floatingLabelText="Which day?" minDate={new Date()} onChange={this.changeDate}/>
          <TimePicker floatingLabelText="What time?" minutesStep={5} onChange={this.changeTime}/>

          <FlatButton label="Calcel" onClick={this.props.handleCancel.bind(this)}/>
          <FlatButton label="Submit Event" primary={true} onClick={this.handleSubmit.bind(this)}/>

        </div>
      </div>
    )
  }
};

export default NewEvent;
