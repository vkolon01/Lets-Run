import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import CommentStore from '../../stores/CommentStore';
import {Link} from 'react-router-dom';
import NewsActions from '../../actions/NewsActions';
import {List, ListItem} from 'material-ui/List';
import {grey800, grey900} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import Clear from 'material-ui/svg-icons/content/clear';
import IconMenu from 'material-ui/IconMenu';
import CircularProgress from 'material-ui/CircularProgress';
import Avatar from 'material-ui/Avatar';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import moment from 'moment';
import 'moment-precise-range-plugin';

class CommentList extends Component{
  constructor(){
    super();
    this.state = {
      comments: CommentStore.comments,
      numberOfComments: 0,
      showComments: false,
      loading: false
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
    this.setState({
      numberOfComments: this.props.post.comments.length
    })
  }

  toggleComments(){
    if(!this.state.showComments){
      NewsActions.loadComments(this.props.post._id);
      this.setState({
        loading: true
      })
    }else{
      this.setState({
        showComments: false,
        loading: false
      });
    }
  }

  handleDelete(i){
    NewsActions.deleteComment()
  }

  updateComments(){
    if(CommentStore.comments[0] && this.props.post._id === CommentStore.comments[0].parent_id){
      this.setState({
        comments: CommentStore.comments,
        numberOfComments: CommentStore.comments.length,
        showComments: true,
        loading: false
      });
    }
  }
  render(){
    let numberOfComments = this.state.numberOfComments;
    let postComments;
    if(this.state.showComments){
      postComments = this.state.comments.map((comment,i) => {
        var postDate = moment(comment.postDate);
        var time_since_post = moment.duration(moment().diff(postDate)).humanize() + " ago";
        return (
          <div key={comment._id} className = "comment">
            <ListItem leftAvatar={
              <Avatar size={30}>{comment.author.username.charAt(0)}</Avatar>}
              primaryText={<div className="username_link"><Link to={`/user/${comment.author._id}`}>{comment.author.username}</Link></div>}
              secondaryText={
                <div>
                  {time_since_post}
                </div>
              }
              initiallyOpen={true}
              nestedItems={[
                <TextField
                  key={comment._id}
                  id={comment._id + 1}
                  disabled={true}
                  multiLine={true}
                  underlineShow={false}
                  style={{cursor: 'default'}}
                  value={comment.message}
                />
              ]}
              rightIconButton={
                <IconButton tooltip="Delete comment" onClick={this.handleDelete.bind(this)}>
                  <Clear color={grey800} hoverColor={grey900}/>
                </IconButton>
              }
              secondaryTextLines={1}
            />
          </div>
        )
      })
    };

    if(this.state.comments){
      return(
        <div>
            <div className={this.state.showDetails? "post_comments post_comments--are-open": "post_comments"} onClick={this.toggleComments.bind(this)}>
              {numberOfComments ? numberOfComments + (numberOfComments > 1 ? " comments" : " comment") : ""}
            </div>

            <ReactCSSTransitionGroup transitionName="toggle"
                                    transitionEnterTimeout={250}
                                    transitionLeaveTimeout={50}>
                                    <List>
                                      {postComments}
                                    </List>
                                    {this.state.loading ? <CircularProgress /> : ""}
            </ReactCSSTransitionGroup>

        </div>

      )
    }
  }
}

export default CommentList;
