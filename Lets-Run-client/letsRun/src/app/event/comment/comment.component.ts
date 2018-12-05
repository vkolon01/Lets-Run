import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommentModule } from 'src/app/models/comment.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CommentService } from '../comment.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  showEditCommentForm = false;
  editCommentForm: FormGroup;

  @Input() comment: CommentModule;
  @Input() eventId: string;


  constructor(private activeRoute: ActivatedRoute, private commentService: CommentService) { }

  ngOnInit() {
    this.editCommentForm = new FormGroup({
      'content': new FormControl(null, {validators: [Validators.required]}),
    });
  }

  edit_Comment() {
    if(this.editCommentForm.invalid){
      return;
    }

    this.commentService.editComment(this.eventId, this.editCommentForm.value.content, this.comment.id);

  }

  showEditCommentInputArea() {
    this.showEditCommentForm = !this.showEditCommentForm;
  }

  deleteComment() {
    this.commentService.deleteComent(this.eventId, this.comment.id);
  }
}
