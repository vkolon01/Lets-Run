import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { environment } from "../../../environments/environment"

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss', '../../global-css/global-input.scss']
})
export class SigninComponent implements OnInit {

  mode = "indeterminate"
  pressedRegister = false;
  loaded = false;

  signInFrom: FormGroup;
  success;
  private authSub: Subscription;
  siteKey = environment.googleReCapcha;
  hide = true;

  compact ="compact"
  en ="en"
  light ="light"
  image ="image"

  constructor(public authService: AuthService,
      private snackBarService: SnackBarService,
      private dialogRef: MatDialogRef<SigninComponent>) { }

  ngOnInit() {
   this.signInFrom = new FormGroup({
      'email': new FormControl(null,  {validators: [Validators.required, Validators.email]}),
      'password': new FormControl(null, {validators: [Validators.required, Validators.minLength(8)]}),
      'validatePassword': new FormControl(null, {validators: [Validators.required, Validators.minLength(8)]}),
      'firstName': new FormControl(null, {validators: [Validators.required]}),
      'lastName': new FormControl(null, {validators: [Validators.required]}),
      'username': new FormControl(null, {validators: [Validators.required]}),
      'dob': new FormControl(null, {validators: [Validators.required]}),
      'recaptcha': new FormControl('', {validators: [Validators.required]})
    });
  }

  onSignin() {
    this.pressedRegister = true;
    
    if(this.signInFrom.invalid) {
      this.snackBarService.showMessage('Please check your registration information!', 'OK');
      this.pressedRegister = false;
      return;
    }
    
      this.authService.createUser(
      this.signInFrom.value.email,
      this.signInFrom.value.password,
      this.signInFrom.value.validatePassword,
      this.signInFrom.value.username,
      this.signInFrom.value.firstName,
      this.signInFrom.value.lastName,
      this.signInFrom.value.dob
    )
        this.authSub = this.authService.getRegisteredListener().subscribe(result => {
          if(result === true) {
            this.onClose();
          } else {
            this.pressedRegister = true;
          }
        })
        

    
  }

  onClose() {
this.dialogRef.close();
  }
}
