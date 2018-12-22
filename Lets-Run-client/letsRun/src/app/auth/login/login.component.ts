import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  logInFrom: FormGroup;
  hide = true;

  constructor(public authService: AuthService, private snackBarService: SnackBarService) { }

  ngOnInit() {
    this.logInFrom = new FormGroup({
      'email': new FormControl(null, {validators: [Validators.required, Validators.email]}),
      'password': new FormControl(null, {validators: [Validators.required, Validators.minLength(8)]})
    });
  }

  onlognin(){
    // console.log(this.logInFrom.value.password);
    
    if (this.logInFrom.invalid) {
      this.snackBarService.showMessage('Please check your login information!', 'OK');
      return;

    }

    this.authService.login(this.logInFrom.value.email, this.logInFrom.value.password);
  }

}
