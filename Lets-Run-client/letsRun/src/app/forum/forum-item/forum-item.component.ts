import { Component, OnInit, Input } from '@angular/core';
import { ForumCategoryModel } from 'src/app/models/forum_category.module';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { ForumService } from 'src/app/services/forum-main.service';
import { DialogService } from 'src/app/services/dialogService';

@Component({
  selector: 'app-forum-item',
  templateUrl: './forum-item.component.html',
  styleUrls: ['./forum-item.component.scss', '../../global-css/forum-css.scss']
})
export class ForumItemComponent implements OnInit {

  editMode = false;
  @Input() forumCategory: ForumCategoryModel;
  generalFormUpdate: FormGroup;
  checked = false;
  deleted = false;

  constructor(private snackBarService: SnackBarService,
              private forumService: ForumService,
              private confirm: DialogService,
              ){ }


  ngOnInit() {
    this.generalFormUpdate = new FormGroup({
      'icon': new FormControl(null, { validators: [Validators.required] }),
      'title': new FormControl(null, { validators: [Validators.required] }),
      'description': new FormControl(null, { validators: [Validators.required] }),
      'forOwnersOnly': new FormControl(false)
    });

    this.prepareFieldsForUpdate();
    
  }

  prepareFieldsForUpdate() {
    this.generalFormUpdate.get('icon').setValue(this.forumCategory.icon);
    this.generalFormUpdate.get('title').setValue(this.forumCategory.title);
    this.generalFormUpdate.get('description').setValue(this.forumCategory.description);
    this.generalFormUpdate.get('forOwnersOnly').setValue(this.forumCategory.forOwnersOnly);
    this.checked = this.forumCategory.forOwnersOnly;
  }

  changed(){
    this.checked = !this.checked;
    if(this.checked) {
      this.generalFormUpdate.get('forOwnersOnly').setValue(true);
    } else {
      this.generalFormUpdate.get('forOwnersOnly').setValue(false);
    }
  }

  checkEditMode() {
    this.editMode = !this.editMode;
  }

  updateForumSection() {
    const icon = this.generalFormUpdate.get('icon').value;
    const title = this.generalFormUpdate.get('title').value;
    const description = this.generalFormUpdate.get('description').value;
    const forOwnersOnly = this.generalFormUpdate.get('forOwnersOnly').value;

    this.forumService.updateForum(this.forumCategory._id, icon, title, description, this.forumCategory.forumCategory, forOwnersOnly)
        .subscribe((result: {updatedForum: ForumCategoryModel}) => {

         this.forumCategory = result.updatedForum;
          
          this.snackBarService.showMessage("updated", "Yay");

          this.checkEditMode();
        })
  }

  deleteSection() {
    this.confirm.openConfirmDialog('Are you sure want to delete the forum section?')
    .afterClosed().subscribe(result => {
      if (result) {
        this.forumService.deleteForumSection(this.forumCategory._id).subscribe(result=> {
          this.snackBarService.showMessageWithDuration('Section deleted', '', 3000);
          this.deleted = true;
        });
        
      }
    })
  }



}
