import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PostCommentModule } from 'src/app/models/postComment.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ForumService } from 'src/app/services/forum-main.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { DialogService } from 'src/app/services/dialogService';
import { AuthService } from 'src/app/services/auth.service';
import * as moment from 'moment';
import { CommentService } from 'src/app/services/comment.service';
// import 'moment/locale/ru';
@Component({
  selector: 'app-post-comment',
  templateUrl: './post-comment.component.html',
  styleUrls: ['./post-comment.component.scss',
   '../../../../../../global-css/global-input.scss',
   '../../../../../../global-css/comment.scss'
  ]
})
export class PostCommentComponent implements OnInit {

  updateCommentForm: FormGroup;
  replyToCommentForm: FormGroup;

  @Input() comment: PostCommentModule;
  @Input() postId: string;

  @Output() comments = new EventEmitter<PostCommentModule[]>();

  createdDate;
  modifiedDate;
  deleted = false;

  updateField = false;
  replyField = false;

  userLang = navigator.language; 

  userId;
  

  constructor(private forumService: ForumService,
              private snackBarService: SnackBarService,
              private confirm: DialogService,
              private authService: AuthService,
              private commentService: CommentService
              ) {
                
                
                
               }

  ngOnInit() {
    this.userId = this.authService.getUserId();

    this.updateCommentForm = new FormGroup({
      'content': new FormControl(null, { validators: [Validators.required] })
    })
    this.replyToCommentForm = new FormGroup({
      'content': new FormControl(null, { validators: [Validators.required] })
    })  
    
    // this.createdDate = moment(this.comment.createdAt).format('DD-MM-YYYY H-mm').toString();
    this.createdDate = moment(this.comment.createdAt).format('LLLL');
    // this.createdDate = moment(this.comment.createdAt).locale('fr').toString();
    // this.createdDate = moment.locale('fr');
    this.modifiedDate = moment(this.comment.updatedAt).format('LLLL');
  }

  replyFieldToggle() {
    this.replyField = !this.replyField;
  }

  replyToComment() {
    this.forumService.replyToCommentToThePost(this.comment._id, this.postId,  this.replyToCommentForm.get('content').value)
        .subscribe((result: { comments: PostCommentModule[] }) => {
          this.emitComments(result.comments);
          this.replyFieldToggle();
        });
  }

  emitComments(comments: PostCommentModule[]) {
    this.comments.emit(comments);
  }

  updateCommentToThePost() {
    this.forumService.updateCommentToThePost(this.comment._id, this.updateCommentForm.get('content').value)
      .subscribe((result: { comment: PostCommentModule }) => {
        this.comment = result.comment;
        this.updateCommentToggle();
      });
  }

  updateCommentToggle() {
    this.updateCommentForm.get('content').setValue(this.comment.content);
    this.updateField = !this.updateField;
  }



  deleteComment() {
    this.confirm.openConfirmDialog('Are you sure want to delete the post?')
      .afterClosed().subscribe(result => {
        if (result) {
          this.forumService.deleteCommentToThePost(this.comment._id).subscribe(result => {
            this.snackBarService.showMessageWithDuration('Comment deleted', '', 3000);
            this.deleted = true;
          })
        }
      })
  }

  reportComment() {
    this.commentService.reportComment('forum', this.comment._id).subscribe(result => {
      this.snackBarService.showMessage(result.message, 'ok');
    });
  }


}
