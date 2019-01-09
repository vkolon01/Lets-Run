import { Directive, ElementRef, OnInit, Output, EventEmitter } from '@angular/core';
// const google = require('@types/googlemaps');
import { } from 'googlemaps';

@Directive({
  selector: '[google-places]'
})
export class GooglePlacesDirective implements OnInit {
  private element: HTMLInputElement;
  @Output() onSelect: EventEmitter<any> = new EventEmitter();

  getLocation(place) {
    let location;
  }

  constructor(private elRef: ElementRef) {
    //elRef will get a reference to the element where
    //the directive is placed
    this.element = elRef.nativeElement;


  }



  ngOnInit() {
    const autocomplete = new google.maps.places.Autocomplete(this.element);

    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      //Emit the new address object for the updated place
      this.onSelect.emit(autocomplete.getPlace().formatted_address);
    });
  }



}