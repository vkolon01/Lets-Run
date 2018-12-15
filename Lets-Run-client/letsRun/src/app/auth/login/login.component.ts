import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  logInFrom: FormGroup;

  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.logInFrom = new FormGroup({
      'email': new FormControl(null, {validators: [Validators.required, Validators.email]}),
      'password': new FormControl(null, {validators: [Validators.required, Validators.minLength(8)]})
    });
  }

  onlognin(){
    console.log(this.logInFrom.value.password);
    
    if (this.logInFrom.invalid) {
      return;
    }

    this.authService.login(this.logInFrom.value.email, this.logInFrom.value.password);
  }

}
