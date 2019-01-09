/// <reference types="@types/googlemaps" />
declare var google: any;
import { } from 'googlemaps';
import { Component, OnInit, ViewChild, Input, OnChanges } from '@angular/core';
import { environment } from "../../../environments/environment"
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { shrinkUpAndDownAnimation } from '../../animations/animationsUpDown'; 

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss'],
  animations: [shrinkUpAndDownAnimation]
})


export class GoogleMapComponent implements OnInit, OnChanges {


  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  geocoder = new google.maps.Geocoder();
  @Input()location: any;
  animation_state = 'up';

  googleUrl = "https://maps.googleapis.com/maps/api/js?key=" + environment.googleApi + "&callback=initMap";

  constructor(private snackBarService: SnackBarService,) { }

  ngOnInit() {

    this.location = "New York";

    var mapProp = {
      center: new google.maps.LatLng(18.5793, 73.8143),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
  }

ngOnChanges() {

  setTimeout(() => {
    this.geocodeAddress(this.geocoder, this.map)
  }, 50);

}

  geocodeAddress(geocoder, resultsMap) {
    // var address = ;
    geocoder.geocode({ 'address': this.location }, function (results, status) {
      if (status === 'OK') {
        resultsMap.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
          map: resultsMap,
          animation: google.maps.Animation.DROP,
          position: results[0].geometry.location
        });
      } else {
        // this.snackBarService.showMessageWithDuration('Map location could not be found', '', 3000);
      }
    });

  }

  toggle_animation_state(){
    this.animation_state = this.animation_state === 'down' ? 'up' : 'down';
  }

}
