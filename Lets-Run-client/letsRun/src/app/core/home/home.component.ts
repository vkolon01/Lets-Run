import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss', '../../global-css/global-input.scss']
})
export class HomeComponent implements OnInit {

  testForm: FormGroup;
  siteKey = "6Le9lJQUAAAAAIkVAgOTBXjMigvUUutw1KIxlRcy";

  constructor() { }

  ngOnInit() {
    this.testForm = new FormGroup({
      'recaptcha': new FormControl('', {validators: [Validators.required]})
    })
  }

  onSend() {
    console.log("success");
    
  }

}
