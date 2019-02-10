import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { environment } from '../environments/environment'
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'LetsRun HomePage';

  constructor(
    private titleService: Title,
    private authService: AuthService,
  ) { }

  googleUrl = "https://maps.googleapis.com/maps/api/js?key=" + environment.googleApi + "&callback=initMap";

  ngOnInit() {
    this.titleService.setTitle(this.title);
    this.authService.autoAuthUser();
  }
}
