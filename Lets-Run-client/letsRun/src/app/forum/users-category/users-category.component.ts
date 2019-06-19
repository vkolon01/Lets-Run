import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TopicCategoryModel } from 'src/app/models/forum_category.module';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { ForumService } from 'src/app/services/forum-main.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-users-category',
  templateUrl: './users-category.component.html',
  styleUrls: ['./users-category.component.scss', '../../global-css/forum-css.scss', '../../global-css/global-input.scss']
})
export class UsersCategoryComponent implements OnInit {

  commonFormAdd: FormGroup;

  mode="indeterminate"
  loaded = false;

  checked = false;
  showGeneralAddField = false;

  userRole;

  private forumSub: Subscription;

  commonCategory: TopicCategoryModel[];

  constructor(private snackBarService: SnackBarService,
              private forumService: ForumService,
              private authService: AuthService        
      ) { }

  ngOnInit() {
    this.commonFormAdd = new FormGroup({
      'icon': new FormControl(null, { validators: [Validators.required] }),
      'title': new FormControl(null, { validators: [Validators.required] }),
      'description': new FormControl(null, { validators: [Validators.required] }),
      'forOwnersOnly': new FormControl(false)
    });

    this.userRole = this.authService.getUserRole();

    this.forumSub = this.forumService.getCategory('Common')
        .subscribe((result: {forumCategory: TopicCategoryModel[]}) => {
          this.commonCategory = result.forumCategory;
          this.loaded = true;
        })
  }

  addCommonForumSection(){
    if (this.commonFormAdd.invalid) {
      this.snackBarService.showMessage('Please fill the required fields', 'OK');
      return;
    }

    this.forumService.addInCategory(this.commonFormAdd.get('icon').value, 
                                    this.commonFormAdd.get('title').value,
                                    this.commonFormAdd.get('description').value,
                                    'Common',
                                    this.commonFormAdd.get('forOwnersOnly').value)
          .subscribe((result: {forumCategory: TopicCategoryModel[]}) => {
          this.commonCategory = result.forumCategory;
          });;


     setTimeout(() => {
      this.commonFormAdd.reset();
      this.showAddField();
     }, 1000)

  }

  changed(){
    this.checked = !this.checked;
    if(this.checked) {
      this.commonFormAdd.get('forOwnersOnly').setValue(true);
    } else {
      this.commonFormAdd.get('forOwnersOnly').setValue(false);
    }
    console.log("this.commonFormAdd.get('forOwnersOnly').value");
    console.log(this.commonFormAdd.get('forOwnersOnly').value);
  }

  showAddField() {
      this.showGeneralAddField = !this.showGeneralAddField;
  }

}
