import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-page404',
  templateUrl: './page404.component.html',
  styleUrls: ['./page404.component.scss', '../../global-css/global-input.scss']
})
export class Page404Component implements OnInit {

  constructor(
    private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("Page Not Found - 404");
  }

}
