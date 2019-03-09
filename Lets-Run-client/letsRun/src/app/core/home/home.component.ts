import { Component, OnInit, OnChanges, HostListener } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../../global-css/global-input.scss', './home.component.scss']
})
export class HomeComponent implements OnInit, OnChanges {

  testForm: FormGroup;
  siteKey = "6Le9lJQUAAAAAIkVAgOTBXjMigvUUutw1KIxlRcy";
  degr: number;
  degInRad;
  inDeg;

  constructor() { }

  ngOnInit() {
    this.countAngle();
    // this.countAngle();
    this.testForm = new FormGroup({
      'recaptcha': new FormControl('', {validators: [Validators.required]})
    })

    
  }

  ngOnChanges() {
    // this.countAngle();
  }

  countAngle() {

    let windowWidth = window.innerWidth
    
    let degInRad = Math.asin(100 / windowWidth);

    const inDeg = degInRad * (180 / Math.PI);

    this.degr = inDeg;
  }

  @HostListener('window:resize', ['$event']) onResizeEvent($event){

    console.log('resize');
    
    this.countAngle();
    // let windowWidth = window.innerWidth
    
    // let degInRad = Math.asin(100 / windowWidth);

    // let inDeg = degInRad * (180 / Math.PI);
    
    // console.log('this.inDeg');
    // console.log( inDeg);

    // this.degr = this.inDeg;

    // var textToRotate = document.getElementsByClassName('first-section');
    
    // this.degr = this.inDeg;
  }
  onSend() {
    console.log("success");
    
  }

}
