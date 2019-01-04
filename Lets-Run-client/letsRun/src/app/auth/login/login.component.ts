import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss',
              '../../global-css/global-input.scss'
              ]
})
export class LoginComponent implements OnInit {
  logInFrom: FormGroup;
  hide = true;
  private authListenerSubs: Subscription;
  userIsAuthenticated = false;
  
  constructor(public authService: AuthService,
              private snackBarService: SnackBarService,
              private dialogRef: MatDialogRef<LoginComponent>
     ) { }

  ngOnInit() {
    this.logInFrom = new FormGroup({
      'email': new FormControl(null, {validators: [Validators.required, Validators.email]}),
      'password': new FormControl(null, {validators: [Validators.required, Validators.minLength(8)]})
    });

    // this.authListenerSubs = this.authService.getAuthStatusListener()
    // .subscribe(isAuthenticated => {
    //   this.userIsAuthenticated = isAuthenticated;
    // });
  }

  onlognin(){
    // console.log(this.logInFrom.value.password);
    
    if (this.logInFrom.invalid) {
      this.snackBarService.showMessage('Please check your login information!', 'OK');
      return;
    }

    this.authService.login(this.logInFrom.value.email, this.logInFrom.value.password);
    
      this.onClose();
    
 
  }

  onClose() {
    this.dialogRef.close();
  }


}
