import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommentModule } from 'src/app/models/comment.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CommentService } from '../../services/comment.service';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialogService';
import * as moment from 'moment';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: [
              '../../global-css/global-input.scss',
              '../../global-css/comment.scss',
              './comment.component.scss'
              ]
})
export class CommentComponent implements OnInit {

  updateCommentForm: FormGroup;
  replyToCommentForm: FormGroup;

  showEditCommentForm = false;
  updateField = false;
  replyField = false;

  editCommentForm: FormGroup;
  userId;

  @Output() deletedCommentEmiter = new EventEmitter<boolean>();
  commentDeleted = false;
  @Input() comment: CommentModule;
  @Input() eventId: string;
   timeAgo;

   @Output() comments = new EventEmitter<CommentModule[]>();

  constructor(private activeRoute: ActivatedRoute,
     private commentService: CommentService,
      private authService: AuthService,
      private confirm: DialogService,
      private snackBarService: SnackBarService
      ) {  }

  ngOnInit() {
    this.userId = this.authService.getUserId();
    console.log(this.comment);
    
    this.updateCommentForm = new FormGroup({
      'content': new FormControl(null, { validators: [Validators.required] })
    })
    this.replyToCommentForm = new FormGroup({
      'content': new FormControl(null, { validators: [Validators.required] })
    })
    this.timeAgo = moment(this.comment.createdAt).fromNow();
    
  }

  replyToComment() {
    this.commentService.replyToComment(this.comment.id, this.eventId,  this.replyToCommentForm.get('content').value)
        .subscribe((result: { comments: CommentModule[] }) => {
          this.emitComments(result.comments);
          this.replyFieldToggle();
        });
  }

  emitComments(comments: CommentModule[]) {
    this.comments.emit(comments);
  }

  replyFieldToggle() {
    this.replyField = !this.replyField;
  }

  updateCommentToggle() {
    this.updateCommentForm.get('content').setValue(this.comment.content);
    this.updateField = !this.updateField;
  }

  updateComment() {

    
    if(this.updateCommentForm.invalid){
      return;
    }

    this.commentService.editComment(this.eventId, this.updateCommentForm.get('content').value, this.comment.id)
        .subscribe(result => {
          
          this.comment.content = result.updatedComment.content;
        });
    this.updateCommentForm.reset();
    this.updateField = !this.updateField;

  }

  showEditCommentInputArea() {
    this.showEditCommentForm = !this.showEditCommentForm;
  }

  deleteComment() {
    if(this.comment.author === this.userId) {
      return;
    }

    this.confirm.openConfirmDialog('Are you sure want to delete the comment?')
    .afterClosed().subscribe(result => {
      if(result) {

        this.commentService.deleteComent(this.eventId, this.comment.id);
        this.updateCommentForm.reset();
        this.commentDeleted = true;

      }
      
    })
  }

  reportComment() {
    this.commentService.reportComment('events', this.comment.id).subscribe(result => {
      this.snackBarService.showMessage(result.message, 'ok');
    });
  }
}
