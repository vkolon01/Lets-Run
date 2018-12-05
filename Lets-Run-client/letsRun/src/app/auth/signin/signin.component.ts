import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  signInFrom: FormGroup;

  constructor(public authService: AuthService) { }

  ngOnInit() {
   this.signInFrom = new FormGroup({
      'email': new FormControl(null, {validators: [Validators.required, Validators.email]}),
      'password': new FormControl(null, {validators: [Validators.required, Validators.min(5)]}),
      'firstName': new FormControl(null, {validators: [Validators.required]}),
      'lastName': new FormControl(null, {validators: [Validators.required]}),
      'username': new FormControl(null, {validators: [Validators.required, Validators.min(5)]}),
      'dob': new FormControl(null, {validators: [Validators.required]}),
    });
  }

  onSignin() {
    if(this.signInFrom.invalid) {
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
