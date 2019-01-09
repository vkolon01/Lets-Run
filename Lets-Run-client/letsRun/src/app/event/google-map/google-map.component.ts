/// <reference types="@types/googlemaps" />
declare var google: any;
import { } from 'googlemaps';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { environment } from "../../../environments/environment"


@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss']
})


export class GoogleMapComponent implements OnInit {


  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;

  @Input()location: any;


  googleUrl = "https://maps.googleapis.com/maps/api/js?key=" + environment.googleApi + "&callback=initMap";

  constructor() { }

  ngOnInit() {


    let geocoder = new google.maps.Geocoder();

    var mapProp = {
      center: new google.maps.LatLng(18.5793, 73.8143),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);

    setTimeout(() => {
      console.log('this.location');
      console.log(this.location); this.geocodeAddress(geocoder, this.map)
    }, 3000)

    // this.geocodeAddress(geocoder, this.map);
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
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });

  }
}
