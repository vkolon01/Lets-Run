import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { ForumService } from 'src/app/services/forum-main.service';
import { Subscription } from 'rxjs';
import { ForumModule } from '../forum.module';
import { TopicCategoryModel } from 'src/app/models/forum_category.module';

@Component({
  selector: 'app-general-category',
  templateUrl: './general-category.component.html',
  styleUrls: ['./general-category.component.scss', '../../global-css/forum-css.scss', '../../global-css/global-input.scss']
})
export class GeneralCategoryComponent implements OnInit {

  generalFormAdd: FormGroup;

  checked = false;
  showGeneralAddField = false;

  private forumSub: Subscription;

  generalCategory: TopicCategoryModel[];

  constructor(private snackBarService: SnackBarService,
              private forumService: ForumService        
      ) { }

  ngOnInit() {
    this.generalFormAdd = new FormGroup({
      'icon': new FormControl(null, { validators: [Validators.required] }),
      'title': new FormControl(null, { validators: [Validators.required] }),
      'description': new FormControl(null, { validators: [Validators.required] }),
      'forOwnersOnly': new FormControl(false)
    });

    this.forumSub = this.forumService.getCategory('General')
        .subscribe((result: {forumCategory: TopicCategoryModel[]}) => {
          this.generalCategory = result.forumCategory;

          console.log('result.forumList');
          console.log(result.forumCategory);

          console.log('this.generalCategory');
          console.log(this.generalCategory);
          
        })
  }

  addGeneralForumSection(){
    if (this.generalFormAdd.invalid) {
      this.snackBarService.showMessage('Please fill the required fields', 'OK');
      return;
    }

    this.forumService.addInCategory(this.generalFormAdd.get('icon').value, 
                                    this.generalFormAdd.get('title').value,
                                    this.generalFormAdd.get('description').value,
                                    'General',
                                    this.generalFormAdd.get('forOwnersOnly').value)
          .subscribe((result: {forumCategory: TopicCategoryModel[]}) => {
          this.generalCategory = result.forumCategory;
          });;


     setTimeout(() => {
      this.generalFormAdd.reset();
      this.showAddField();
     }, 1000)

  }

  changed(){
    this.checked = !this.checked;
    if(this.checked) {
      this.generalFormAdd.get('forOwnersOnly').setValue(true);
    } else {
      this.generalFormAdd.get('forOwnersOnly').setValue(false);
    }
  }

  showAddField() {
      this.showGeneralAddField = !this.showGeneralAddField;
  }

}
