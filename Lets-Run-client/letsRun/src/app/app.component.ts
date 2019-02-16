import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { environment } from '../environments/environment'
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'letsRun';

  constructor(
    private authService: AuthService
  ) { }

  googleUrl = "https://maps.googleapis.com/maps/api/js?key=" + environment.googleApi + "&callback=initMap";

  ngOnInit() {

    this.authService.autoAuthUser();
  }
}
