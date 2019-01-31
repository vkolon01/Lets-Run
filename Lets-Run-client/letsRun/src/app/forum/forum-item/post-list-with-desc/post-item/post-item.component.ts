import { Component, OnInit, Input } from '@angular/core';
import { PostModel } from 'src/app/models/post.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss', '../../../../global-css/global-input.scss', '../../../../global-css/forum-css.scss']
})
export class PostItemComponent implements OnInit {



  @Input() post: PostModel;
  @Input() topicId: string;
  

  constructor(private route: Router) { }

  ngOnInit() {
  }



  openPostDetail(post_id: string) {
    this.route.navigate(['/forum/' + this.topicId  + "/" + post_id]);
  }



}
