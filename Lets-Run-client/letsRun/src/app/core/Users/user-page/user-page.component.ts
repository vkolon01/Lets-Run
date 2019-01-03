import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { UserModel } from '../../../models/user.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { mimeType } from 'src/app/validators/mime-type.validator';
import { DialogService } from 'src/app/services/dialogService';
// import { userInfo } from 'os';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss',
              '../../../global-css/global-input.scss'
             ]
})
export class UserPageComponent implements OnInit {

  form: FormGroup;
  imagePreview: string;
  user_id: string;
  current_user_id: string;
  user: UserModel;

  private userSubscription: Subscription;


  constructor(public userService: UserService,
    private activeRoute: ActivatedRoute,
     private authService: AuthService,
     private confirm: DialogService
     ) { }

  ngOnInit() {

    this.form = new FormGroup({
      image: new FormControl(null, { validators: [Validators.required], asyncValidators: [ mimeType ] })
    })

    

    this.activeRoute.paramMap.subscribe((paramMap: ParamMap) => {

      this.user_id = paramMap.get('user_id');
      

      
        this.userService.getUserInfo(this.user_id, '');

        this.userSubscription = this.userService.getUserListener()
            .subscribe((value: {user: UserModel}) => {
              this.user = value.user
            })

            this.current_user_id = this.authService.getUserId();

  })



}

onImagePicked(event: Event){

  if(this.user_id === this.current_user_id) {
    return;
  }

  const file = (event.target as HTMLInputElement).files[0];
  this.form.patchValue({image: file});
  this.form.get('image').updateValueAndValidity();
  const reader = new FileReader();
  reader.onload = () => {
    this.imagePreview = reader.result as string;
  };
  reader.readAsDataURL(file);
}

  calculateAge(birthday) { // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}



  freindManipulation() {
    this.userService.freindManipulating(this.user_id);
  }

  uploadAvatar() {
    if(this.form.invalid){
      return;
    }

    this.userService.uploadAvatar(this.user_id,  this.form.value.image);
    this.form.reset();
  }


}

