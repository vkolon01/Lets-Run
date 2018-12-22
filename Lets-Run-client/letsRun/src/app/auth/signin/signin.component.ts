import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss', '../../global-css/global-input.scss']
})
export class SigninComponent implements OnInit {

  signInFrom: FormGroup;
  hide = true;

  constructor(public authService: AuthService,  private snackBarService: SnackBarService) { }

  ngOnInit() {
   this.signInFrom = new FormGroup({
      'email': new FormControl(null,  {validators: [Validators.required, Validators.email]}),
      'password': new FormControl(null, {validators: [Validators.required, Validators.minLength(8)]}),
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
      this.signInFrom.value.username,
      this.signInFrom.value.firstName,
      this.signInFrom.value.lastName,
      this.signInFrom.value.dob
    )
  }
}
