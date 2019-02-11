import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {
  
      // array of all items to be paged 
      allItems: any[];

      // pager object
      @Input() pager: any = {};
      @Output() page : EventEmitter<number> = new EventEmitter<number>();
      // paged items
      pagedItems: any[];

  constructor() { }

  ngOnInit() {
    console.log('this.pager');
    console.log(this.pager);
  }

  setPage(pageNumber: number) {
    this.page.emit(pageNumber);
  }



}
