import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from './services/auth.service';
import { environment } from '../environments/environment'
import * as moment from 'moment';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'letsRun';
  header;
  main;
  userLang = navigator.language; 

  constructor(
    private authService: AuthService,
  ) { }

  googleUrl = "https://maps.googleapis.com/maps/api/js?key=" + environment.googleApi + "&callback=initMap";

  ngOnInit() {
    console.log(this.userLang);
    moment.locale(this.userLang);
    this.header = document.getElementById('header_id').clientHeight;
    this.main = document.getElementById('main_field');
    this.main.style.marginTop = this.header + 'px';
    this.authService.autoAuthUser();
  }

  @HostListener('window:resize', ['$event']) onResizeEvent($event){
    this.header = document.getElementById('header_id').clientHeight;

    this.main = document.getElementById('main_field');
    this.main.style.marginTop = this.header + 'px';
    console.log('this.main');
    console.log(this.main);
    
  }
}
