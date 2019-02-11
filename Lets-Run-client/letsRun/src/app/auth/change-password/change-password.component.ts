import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { SnackBarService } from '../../services/snack-bar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material'

import { LoginComponent } from '../../auth/login/login.component';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss', '../../global-css/global-input.scss']
})
export class ChangePasswordComponent implements OnInit {

  resetPasswordForm: FormGroup;
  token: string;
  userId: string;


  constructor(private userService: UserService,
              private snackBarService: SnackBarService,
              private route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog
              ) { }

  ngOnInit() {
    this.resetPasswordForm = new FormGroup({
      'userId': new FormControl(null, {validators: [Validators.required]}),
      'password': new FormControl(null, {validators: [Validators.required, Validators.minLength(8)]}),
      'confirmPassword': new FormControl(null, {validators: [Validators.required, Validators.minLength(8)]}),
      'resetToken': new FormControl(null, {validators: [Validators.required]})
    });
    // tokenParams = 
    this.route.params.subscribe(param => {
      this.token = param.resetToken;
    })

    this.userService.userGetChangePassword(this.token)
        .subscribe(result => {
          console.log(result);
          this.resetPasswordForm.setValue({
            userId: result.userId,
            password: '',
            confirmPassword: '',
            resetToken: result.passwordToken
          });
        })
  }

  onReset() {
    if (this.resetPasswordForm.invalid) {
      this.snackBarService.showMessage('Please enter fields!', 'OK');
      return;
    }

    if (this.resetPasswordForm.value.password !== this.resetPasswordForm.value.confirmPassword) {
      this.snackBarService.showMessage('Password have to match', 'OK');
      return;
    }

    this.userService.changePassword(this.resetPasswordForm.value.resetToken, this.resetPasswordForm.value.userId, this.resetPasswordForm.value.password)
                      .subscribe(result => {
                this.snackBarService.showMessageWithDuration('Password changed, login withyour new password',  'ok', 3000);
                const dialogConfig = new MatDialogConfig();
                dialogConfig.disableClose = false;
                dialogConfig.autoFocus = true;
                dialogConfig.width = "80%";
                dialogConfig.height = "50%";
            
                this.dialog.open(LoginComponent, dialogConfig);
                this.router.navigate(['/']);
              });


  }

}
