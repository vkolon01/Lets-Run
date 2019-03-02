import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EmailContactService } from 'src/app/services/emailContact.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { ReCaptcha2Component } from 'ngx-captcha';
import { environment } from "../../../environments/environment"
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['../../global-css/global-input.scss', './contact-us.component.scss']
})
export class ContactUsComponent implements OnInit, OnDestroy {

  @ViewChild('captchaId') captchaElem: ReCaptcha2Component;

  sendEmailForm: FormGroup;
  // siteKey = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";
  siteKey = environment.googleReCapcha;

  idNum;

  constructor(
    private dialogRef: MatDialogRef<ContactUsComponent>,
    private contactUsService: EmailContactService,
    private snackBarService: SnackBarService
  ) { }

  ngOnInit() {
    this.sendEmailForm = new FormGroup({
      'email': new FormControl(null, {validators: [Validators.required, Validators.email]}),
      'subject': new FormControl(null),
      'message': new FormControl(null),
      'fullName': new FormControl(null),
      'recaptcha': new FormControl('', {validators: [Validators.required]})
    })
  }

  ngOnDestroy() {
    this.reset();
  }

  reset(): void {
    this.captchaElem.resetCaptcha();
  }

  getInfo(): void {
    console.log( 'this.captchaElem.reCaptchaApi');
    console.log( this.captchaElem.captchaScriptElem);
    
    this.captchaElem.reCaptchaApi;
  }

  id(event) {
    console.log('event');
    console.log(event);
  }

  onSend() {
    console.log('num');
    console.log(this.idNum);
    if(!this.sendEmailForm.valid) {
      return;
    }

    const email   = this.sendEmailForm.get('email').value;
    const subject = this.sendEmailForm.get('subject').value;
    const message = this.sendEmailForm.get('message').value;
    const fullName = this.sendEmailForm.get('fullName').value;

    this.contactUsService.contactUsMessage(email, subject, message, fullName)
        .subscribe(result => this.snackBarService.showMessageWithDuration("Message to us was send", "", 1000))
    

    this.sendEmailForm.reset();
    this.onClose();


      }

      onClose() {
        this.dialogRef.close();
          }

}
