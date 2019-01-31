import { Component, OnInit, Input } from '@angular/core';
import { PostCommentModule } from 'src/app/models/postComment.model';
import * as moment from 'moment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ForumService } from 'src/app/services/forum-main.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { DialogService } from 'src/app/services/dialogService';

@Component({
  selector: 'app-post-comment',
  templateUrl: './post-comment.component.html',
  styleUrls: ['./post-comment.component.scss', '../../../../../../global-css/global-input.scss']
})
export class PostCommentComponent implements OnInit {

  updateCommentForm: FormGroup;
  @Input() comment: PostCommentModule;
  createdDate;
  modifiedDate;
  deleted = false;

  updateField = false;

  constructor(private forumService: ForumService,
              private snackBarService: SnackBarService,
              private confirm: DialogService, ) { }

  ngOnInit() {
    this.updateCommentForm = new FormGroup({
      'content': new FormControl(null, { validators: [Validators.required] })
    })
    this.createdDate = moment(this.comment.createdAt).format('DD-MM-YYYY H-mm').toString();
    this.modifiedDate = moment(this.comment.updatedAt).format('DD-MM-YYYY H-mm').toString();
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

}
