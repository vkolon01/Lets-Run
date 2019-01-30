import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-post-list-with-desc',
  templateUrl: './post-list-with-desc.component.html',
  styleUrls: ['./post-list-with-desc.component.scss', '../../../global-css/global-input.scss',  '../../../global-css/forum-css.scss']
})
export class PostListWithDescComponent implements OnInit {

  forumList_id;
  // topicCategory: 

  constructor(private activeRoute: ActivatedRoute) { }

  ngOnInit() {

    this.activeRoute.paramMap.subscribe((paramMap: ParamMap) => {

      this.forumList_id = paramMap.get('forumList_id');

    });
  }

}
