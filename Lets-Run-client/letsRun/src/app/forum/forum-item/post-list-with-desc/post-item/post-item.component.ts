import { Component, OnInit, Input } from '@angular/core';
import { PostModel } from 'src/app/models/post.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { post } from 'selenium-webdriver/http';
import * as moment from 'moment';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss', '../../../../global-css/global-input.scss', '../../../../global-css/forum-css.scss']
})
export class PostItemComponent implements OnInit {



  @Input() post: PostModel;
  @Input() topicId: string;
  commentDate;
  commentsCount;
  editMode = false;

  constructor(private route: Router) { }

  ngOnInit() {
    this.commentsCount = this.post.postComments.length;
    if(this.post.lastComment) {
      this.commentDate = moment(this.post.lastComment.date).format("DD MMMM YY - HH:mm");
    }
  }



  openPostDetail(post_id: string) {
    this.route.navigate(['/forum/' + this.topicId  + "/" + post_id]);
  }



}
