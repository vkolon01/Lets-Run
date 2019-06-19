import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostModel } from 'src/app/models/post.model';
import { ForumService } from 'src/app/services/forum-main.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { DialogService } from 'src/app/services/dialogService';
import { PostCommentModule } from 'src/app/models/postComment.model';
import { PagerService } from 'src/app/services/pager.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss', '../../../../../global-css/forum-css.scss', '../../../../../global-css/global-input.scss']
})
export class PostDetailComponent implements OnInit {

  mode="indeterminate"
  loaded = false;

  updatePostForm: FormGroup;
  addCommentForm: FormGroup;

    //total items in collection
    totalComments: number;

      // paged items
      pagedItems: any[];

      // pager object
      pager: any = {};

  editMode = false;
  post: PostModel;
  post_id: string;
  postComments: PostCommentModule[] = [];

  userId;
  
  constructor(private forumService: ForumService,
              private activeRoute: ActivatedRoute,
              private snackBarService: SnackBarService,
              private confirm: DialogService,
              private route: Router ,
              private pagerService: PagerService,
              private authService: AuthService
    ) { }

  ngOnInit() {
    this.userId = this.authService.getUserId();
    this.updatePostForm = new FormGroup({
      'title': new FormControl(null, { validators: [Validators.required] }),
      'description': new FormControl(null, { validators: [Validators.required] }),
      'content': new FormControl(null, { validators: [Validators.required] })
    });

    this.addCommentForm = new FormGroup({
      'content': new FormControl(null, { validators: [Validators.required] })
    })

    this.activeRoute.paramMap.subscribe((paramMap: ParamMap) => {

      this.post_id = paramMap.get('post_id');

      this.forumService.getPostById(this.post_id).subscribe((result: {post: PostModel}) => {
        this.post = result.post;
        this.loaded = true;
        // console.log('post?.author._id');
        // console.log(this.post.author._id);

        // console.log('userId');
        // console.log(this.userId);

        // console.log('userId === ');
        // console.log(this.userId === this.post.author._id);

      });


      
    });

    this.setPage(1);
  }

  updateComments(comments: PostCommentModule[]) {
    this.postComments = comments;
    this.setPage(1);
  }

  setPage(page: number) {
    if (page < 1 || this.pager.totalPages &&  page > this.pager.totalPages) {
        return;
    }
    
        // get current page of items
        this.forumService.getCommentToThePost(this.post_id, 10, page).subscribe((result: {comments: PostCommentModule[], commentsCount: number}) => {
          this.postComments = result.comments;
          this.totalComments = result.commentsCount;
              // get pager object from service
          this.pager = this.pagerService.getPager(this.totalComments, page);

        });
}


  updateModeToggle() {
    this.editMode = !this.editMode;

    this.updatePostForm.get('title').setValue(this.post.title);
    this.updatePostForm.get('description').setValue(this.post.description);
    this.updatePostForm.get('content').setValue(this.post.content);
  }

  updatePost() {

    const title =  this.updatePostForm.get('title').value;
    const description =  this.updatePostForm.get('description').value;
    const content =  this.updatePostForm.get('content').value;

    this.forumService.updatePostById(this.post_id, title, description, content)
        .subscribe((result: {updatedPost: PostModel}) => {
          this.post = result.updatedPost;
          this.updateModeToggle();
        });

  }

  deletePost() {
    this.confirm.openConfirmDialog('Are you sure want to delete the post?')
    .afterClosed().subscribe(result => {
      if (result) {
        this.forumService.deletePost(this.post_id).subscribe(result => {
          this.snackBarService.showMessageWithDuration('Post deleted', '', 3000);
          this.route.navigate(['/forum']);
        })
      }
    })
  }

  addCommentToThePost() {

    if(this.addCommentForm.invalid) {
      this.snackBarService.showMessageWithDuration("Can't post empty content", '', 3000);
      return;
    }

    this.forumService.addCommentToThePost(this.post_id, this.addCommentForm.get('content').value)
        .subscribe((result: {comments: PostCommentModule[]}) => {
          this.setPage(1);
        })

        this.addCommentForm.reset();
  }

}
