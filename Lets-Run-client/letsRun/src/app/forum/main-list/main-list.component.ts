import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-main-list',
  templateUrl: './main-list.component.html',
  styleUrls: ['./main-list.component.scss', '../../global-css/global-input.scss', '../../global-css/forum-css.scss']
})
export class MainListComponent implements OnInit {

  constructor(private meta: Meta) { }

  ngOnInit() {
    this.meta.addTags([
      {name: 'description', content: 'this is forum page'},
      {name: 'author', content: 'this is forum author'},
      {name: 'keywords', content: 'this is forum , Meta Service'}
    ]);
  }

}
