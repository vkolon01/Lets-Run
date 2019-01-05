import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss', '../../global-css/global-input.scss']
})
export class SigninComponent implements OnInit {

  signInFrom: FormGroup;
  success;
  private authSub: Subscription;

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
    });
  }

  onSignin() {
    console.log(this.signInFrom);
    
    if(this.signInFrom.invalid) {
      this.snackBarService.showMessage('Please check your registration information!', 'OK');
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
          }
        })
        

    
  }

  onClose() {
this.dialogRef.close();
  }
}
