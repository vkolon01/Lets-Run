import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TopicCategoryModel } from 'src/app/models/forum_category.module';
import { ForumService } from 'src/app/services/forum-main.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostModel } from 'src/app/models/post.model';

@Component({
  selector: 'app-post-list-with-desc',
  templateUrl: './post-list-with-desc.component.html',
  styleUrls: ['./post-list-with-desc.component.scss', '../../../global-css/global-input.scss',  '../../../global-css/forum-css.scss']
})
export class PostListWithDescComponent implements OnInit {

  forumList_id;
  topic: TopicCategoryModel; 
  addMode = false;
  posts: PostModel[];

  addPostToTopic: FormGroup;

  constructor(private activeRoute: ActivatedRoute,
              private forumService: ForumService
              ) { }

  ngOnInit() {

    this.addPostToTopic = new FormGroup({
      'title': new FormControl(null, { validators: [Validators.required] }),
      'description': new FormControl(null, { validators: [Validators.required] }),
      'content': new FormControl(null, { validators: [Validators.required] })
    });

    this.activeRoute.paramMap.subscribe((paramMap: ParamMap) => {

      this.forumList_id = paramMap.get('forumList_id');

      this.forumService.getTopicById(this.forumList_id).subscribe((result: {foundTopic: TopicCategoryModel}) => {
        this.topic = result.foundTopic;
    });

    this.forumService.getPostsForTopic(this.forumList_id).subscribe((result: {postsForTopic: PostModel[]}) => {
      this.posts = result.postsForTopic;
    });

    });

  }

  addPost() {
    const topic_id = this.forumList_id;
    const title = this.addPostToTopic.get('title').value;
    const description = this.addPostToTopic.get('description').value;
    const content = this.addPostToTopic.get('content').value;

    this.forumService.addPostToTheTopic(topic_id, "folder_open" , title, description, content).subscribe((result: {postsList: PostModel[]}) => {
      this.posts = result.postsList;

      this.addModeToggle();
    })
  }

  addModeToggle() {
    this.addMode = !this.addMode;
  }

}
