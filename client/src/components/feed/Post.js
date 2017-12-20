import React,{Component} from 'react';
import NewComment from './NewComment';
import AuthStore from '../../stores/AuthStore';
import NewsActions  from '../../actions/NewsActions';
import history from '../../services/History';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import CommentStore from '../../stores/CommentStore';
import CommentList from './CommentList';
import {Link} from 'react-router-dom';
import IconButton from 'material-ui/IconButton';
import Favorite from 'material-ui/svg-icons/action/favorite';
import {red500, grey800, grey900} from 'material-ui/styles/colors';
import Delete from 'material-ui/svg-icons/action/delete';
import Comment from 'material-ui/svg-icons/communication/comment';
import Paper from 'material-ui/Paper';
import Badge from 'material-ui/Badge';
import Divider from 'material-ui/Divider';
import moment from 'moment';

class Post extends Component{
  constructor(){
    super(...arguments);
    this.state = {
      showCommentInputContainer: false,
      showDeleteConfirmatioin: false,
      likes: this.props.post.post.likes ? this.props.post.post.likes.length : 0,
      liked: this.props.post.post.likes ? this.props.post.post.likes.includes(AuthStore.user_id) : false
    };
  }


  loadComments(){
    NewsActions.loadComments(this.props.post._id);
  }


  likePost(){
    NewsActions.likePost(this.props.post.post._id);
    if(AuthStore.isLoggedIn()){
      if(!this.state.liked){
        this.setState({
          likes: this.state.likes + 1,
          liked: true
        })
      }else{
        this.setState({
          likes: this.state.likes - 1,
          liked: false
        })
      }
    }else{
      history.replace('/sign_in')
    }
  }
  deletePost(){
    NewsActions.deletePost(this.props.post.post._id)
    this.toggleDeleteConfirmation()
    this.props.handleReload();
  }

  toggleCommentInputContainer(){
    this.setState({
      showCommentInputContainer: !this.state.showCommentInputContainer,
    })
  }

  toggleDeleteConfirmation(){
    this.setState({
      showDeleteConfirmatioin: !this.state.showDeleteConfirmatioin
    })
  }

  render(){
    let author = this.props.post.user;
    let post = this.props.post.post;
    let event = this.props.post.event;
    let post_id = post._id;
    console.log(this.props.post)
    let deleteActions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.toggleDeleteConfirmation.bind(this)}
      />,
      <FlatButton
        label="Delete"
        primary={true}
        onClick={this.deletePost.bind(this)}
      />
    ]
    let postComments;


    return(
      <Paper className="post">
        <div className="post_body">
          <div className="post_username"> <Link to={`/user/${author._id}`}>{author.username}</Link> : </div>
          {/* --- Post body --- */}
          <Paper>
            <div className="post_message"> {post.message} </div>

          <Divider/>
          {/* --- Event body */}
          {event ?

            <div className="event_body">
              Event Details:
              <div className="event_distance"> Distance: {event.distance} Km </div>
              <div className="event_date"> {moment(event.eventDate).format("dddd, DD-MM-YY")} </div>
              <div className="event_time"> At {moment(event.eventDate).format("hh:mm")} </div>
            </div>
          :
            ""
          }
          </Paper>

          {/* --- Icon post menu --- */}
          {/* Post delete icon */}

          {author && AuthStore.username === author.username ?
            <IconButton tooltip="Delete post" onClick={this.toggleDeleteConfirmation.bind(this)}>
              <Delete color={grey800} hoverColor={grey900}/>
            </IconButton>
            :
            ""
          }
          <Dialog
            actions = {deleteActions}
            model={false}
            open={this.state.showDeleteConfirmatioin}
            onRequestClose={this.toggleDeleteConfirmation.bind(this)}
          >
          Delete Post?
          </Dialog>

          {/* Like icon */}

          <Badge badgeContent={this.state.likes} primary={true} badgeStyle={{top: 15,right: 15}}>
            <IconButton tooltip="Like post" onClick={this.likePost.bind(this)}>
              <Favorite color={this.state.liked ? red500  : grey800} hoverColor={red500}/>
            </IconButton>
          </Badge>



          {/* Leave a Comment icon */}
          <IconButton tooltip="Add comment" onClick={this.toggleCommentInputContainer.bind(this)}>
            <Comment/>
          </IconButton>
          <div className="postOptions">
            {this.state.showCommentInputContainer ?
              <NewComment
                showComments = {this.loadComments.bind(this)}
                post_id = {post_id}
              />
            :
              ""
            }
          </div>

          <Divider/>

        </div>

        <CommentList post = {post}/>
      </Paper>
    )
  }
}

export default Post;
