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
import {red500} from 'material-ui/styles/colors';
import Delete from 'material-ui/svg-icons/action/delete';
import Comment from 'material-ui/svg-icons/communication/comment';
import Paper from 'material-ui/Paper';
import Badge from 'material-ui/Badge';
import Divider from 'material-ui/Divider';

class Post extends Component{
  constructor(){
    super(...arguments);
    this.state = {
      showCommentInputContainer: false,
      showDeleteConfirmatioin: false,
      likes: this.props.post.likes ? this.props.post.likes.length : 0,
      liked: this.props.post.likes ? this.props.post.likes.includes(this.props.author._id) : false
    };
  }


  loadComments(){
    NewsActions.loadComments(this.props.post._id);
  }


  likePost(){
    NewsActions.likePost(this.props.post._id);
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
    NewsActions.deletePost(this.props.post._id)
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
    let author = this.props.author;
    let post = this.props.post;
    let post_id = post._id;
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

          {/* ---Main post body--- */}
          <div className="post_username"> <Link to={`/user/${author._id}`}>{author.username}</Link> : </div>
          <div className="post_message"> {post.message} </div>

          <Divider/>
          {/*--- Icon post menu ---*/}

          {/* Post delete icon */}
          {author && AuthStore.username === author.username ?
            <IconButton tooltip="Delete post" onClick={this.toggleDeleteConfirmation.bind(this)}>
              <Delete/>
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

          <Badge badgeContent={this.state.likes} primary={true} badgeStyle={{top: 15,right: 15}}>
            <IconButton tooltip="Like post" onClick={this.likePost.bind(this)}>
              <Favorite color={this.state.liked ? red500  : ""} hoverColor={red500}/>
            </IconButton>
          </Badge>

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
