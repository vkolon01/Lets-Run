import { Component, OnInit, Input } from '@angular/core';
import { PostModel } from 'src/app/models/post.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss', '../../../../global-css/global-input.scss', '../../../../global-css/forum-css.scss']
})
export class PostItemComponent implements OnInit {

  updatePostToTopic: FormGroup;

  @Input() post: PostModel;
  editMode = false;

  constructor() { }

  ngOnInit() {
    this.updatePostToTopic = new FormGroup({
      'title': new FormControl(null, { validators: [Validators.required] }),
      'description': new FormControl(null, { validators: [Validators.required] }),
      'content': new FormControl(null, { validators: [Validators.required] })
    });
  }

  updatePost() {

  }

  updateModeToggle() {
    this.editMode = !this.editMode;
  }

}
