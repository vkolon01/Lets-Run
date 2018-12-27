import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommentModule } from 'src/app/models/comment.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CommentService } from '../comment.service';
import { AuthService } from 'src/app/auth/auth.service';
import { DialogService } from 'src/app/services/dialogService';
import * as moment from 'moment';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  showEditCommentForm = false;
  editCommentForm: FormGroup;
  userId;

  @Output() deletedCommentEmiter = new EventEmitter<boolean>();
  commentDeleted = false;
  @Input() comment: CommentModule;
  @Input() eventId: string;
   timeAgo;



  constructor(private activeRoute: ActivatedRoute,
     private commentService: CommentService,
      private authService: AuthService,
      private confirm: DialogService
      ) {  }

  ngOnInit() {
    this.userId = this.authService.getUserId();
    this.editCommentForm = new FormGroup({
      'content': new FormControl(null, {validators: [Validators.required]}),
    });
    this.timeAgo = moment(this.comment.createdAt).fromNow();
    
  }

  edit_Comment() {

    
    if(this.editCommentForm.invalid){
      return;
    }

    this.commentService.editComment(this.eventId, this.editCommentForm.value.content, this.comment.id);
    this.editCommentForm.reset();
    this.showEditCommentForm = !this.showEditCommentForm;

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
        this.editCommentForm.reset();
        this.commentDeleted = true;

      }
      
    })
  }
}
