import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private meta: Meta,) { }

  ngOnInit() {
    this.meta.addTags([
      {name: 'description', content: 'this is home page'},
      {name: 'author', content: 'this is home author'},
      {name: 'keywords', content: 'this is home , Meta Service'}
    ]);
  }

}
