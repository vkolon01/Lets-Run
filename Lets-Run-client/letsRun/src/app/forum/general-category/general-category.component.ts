import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-general-category',
  templateUrl: './general-category.component.html',
  styleUrls: ['./general-category.component.scss', '../../global-css/forum-css.scss']
})
export class GeneralCategoryComponent implements OnInit {

  generalForum =[{icon: "contacts", title: "one", desc: "two"}, ];
  generalFormAdd: FormGroup;

  constructor(private snackBarService: SnackBarService) { }

  ngOnInit() {
    this.generalFormAdd = new FormGroup({
      'icon': new FormControl(null, { validators: [Validators.required] }),
      'title': new FormControl(null, { validators: [Validators.required] }),
      'description': new FormControl(null)
    });
  }

  addGeneralForumSection(){
    if (this.generalFormAdd.invalid) {
      this.snackBarService.showMessage('Please fill the required fields', 'OK');
      return;
    }
  }

}
