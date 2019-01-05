import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss', '../../global-css/global-input.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetEmailForm: FormGroup;

  constructor(private userService: UserService,
              private snackBarService: SnackBarService,
              ) { }

  ngOnInit() {
    this.resetEmailForm = new FormGroup({
      'email': new FormControl(null, {validators: [Validators.required, Validators.email]})
    });
  }

  onRequest() {
    if (this.resetEmailForm.invalid) {
      this.snackBarService.showMessageWithDuration('Please enter email!',  'ok', 3000);
      return;
    }

    this.userService.userGetResetToken(this.resetEmailForm.value.email);
  }

}
