import { Component, OnInit} from '@angular/core';
import { EventModule } from '../../models/event.model';
import { EventService } from '../../services/event.service';
import { CommentService } from '../../services/comment.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription,} from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import { Datasource } from 'ngx-ui-scroll';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { DialogService } from 'src/app/services/dialogService';
import * as moment from 'moment';
import { MatDialog, MatDialogConfig } from '@angular/material'
import { AddEventComponent } from '../add-event/add-event.component';
import { WeatherService } from 'src/app/services/weather.service';
import { Weather } from 'src/app/models/weather.model';
import {Router} from "@angular/router"
declare var google: any;
import { } from 'googlemaps';
import { timeout } from 'rxjs/operators';

registerLocaleData(localeRu);

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss',
    '../../global-css/global-input.scss'
  ]
})
export class EventDetailComponent implements OnInit {

  geocoder = new google.maps.Geocoder();

  eventCreatedAt;
  event: EventModule;
  formatedEventDate: string;
  willShowWeatherIn: string;
  eventLocation: string;
  private eventSub: Subscription;

  eventCreatorName: string;
  creatorId: string;
  private creatorNameAndIdSub: Subscription;

  invite: false;
  eventId: string;

  eventLikes: string[] = [];
  private eventLikeSubscribe: Subscription;
  containsLike: boolean;

  currentWeather: Weather;
  weatherForecast: Weather[] = [];

  eventWillAttempt: string[] = [];
  containsEvent: boolean;

  commentForm: FormGroup;

  commentInputArea = false;

  userId: string;

  MIN = 1;
  MAX = 1;

  constructor(private eventService: EventService,
    private activeRoute: ActivatedRoute,
    private commentService: CommentService,
    private authService: AuthService,
    private snackBarService: SnackBarService,
    private confirm: DialogService,
    private dialog: MatDialog,
    private weatherSer: WeatherService,
    private router: Router
  ) { }

  datasource = new Datasource({
    get: (index, count, success) => {

      const start = Math.max(this.MIN, index);
      const end = Math.min(index + count - 1, this.MAX);

      return this.commentService.getCommentListFormNgxUiScroll(this.eventId, index, count)
        .subscribe(result => {
          success(result.comments);

        });
    }

  });

  ngOnInit() {

    this.commentForm = new FormGroup({
      'content': new FormControl(null, { validators: [Validators.required] }),
    });

    this.userId = this.authService.getUserId();

    this.activeRoute.paramMap.subscribe((paramMap: ParamMap) => {

      this.eventId = paramMap.get('event_id');
      this.eventService.getEventById(this.eventId);

      this.eventLikeSubscribe = this.eventService.getLikesUpdate()
      .subscribe((value: { likes: string[] }) => {
        this.eventLikes = value.likes
      });

      this.creatorNameAndIdSub = this.eventService.getCreatorNameAndId()
      .subscribe((value: { creatorName: string, creatorId: string }) => {
        this.creatorId = value.creatorId;
        this.eventCreatorName = value.creatorName;
      });

      this.eventSub = this.eventService.getEventUpdate()
        .subscribe((value: { event: EventModule }) => {
          this.event = value.event;
          this.eventLocation = value.event.location;
          this.eventCreatedAt = moment(this.event.createdAt).fromNow();
          this.checkForLikeExistence();
          this.checkForAttemptExistence();
          const eventDate = value.event.eventDate;
          this.formatedEventDate = moment(eventDate).format('YYYY-MM-DD').toString();
          this.geocodeAddress(this.geocoder, value.event.location);
        });

    });
  }

  private weatherDataCololect(latLngCoordinats: string) {
    
   this.weatherSer.getWeatherForecast(latLngCoordinats).subscribe((weather: any) => {
      weather.forecast.forecastday.forEach(element => {
        this.weatherForecast.push({
          date: element.date,
          temp_c: element.day.avgtemp_c,
          condition: {
            text: element.day.condition.text,
            icon: element.day.condition.icon,
          }
        });

      });
      
      this.weatherForecast.forEach(data => {
        if(data.date === this.formatedEventDate) {
          this.currentWeather = {
            temp_c: data.temp_c,
            condition: {
              text: data.condition.text,
              icon: data.condition.icon,
            }
          }
        }
      })

      if(!this.currentWeather && moment(this.event.eventDate).isAfter(moment())) {
       this.willShowWeatherIn = moment(this.event.eventDate).subtract(6, 'days').fromNow();
      }

    });
  }

  geocodeAddress(geocoder, location) {
    geocoder.geocode({ 'address': location },  (results, status) => {
      if (status === 'OK') {
        this.weatherDataCololect(results[0].geometry.location.lat() + "," + results[0].geometry.location.lng());
      } else {
        this.snackBarService.showMessage('Map location could not be found', 'ok');
      }
    });
  }

  onEventEdit() {

    const eventInfoToUpdate = ({
      id: this.eventId,
      title: this.event.title,
      location: this.event.location,
      distance: this.event.distance,
      pace: this.event.pace,
      image: this.event.picture,
      eventDate: this.event.eventDate,
      eventTime: this.event.eventTime,
      description: this.event.description,
      privateEvent: this.event.privateEvent
    });

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "80%";
    dialogConfig.height = "80%";
    dialogConfig.data = eventInfoToUpdate;

    this.dialog.open(AddEventComponent, dialogConfig);
  }

  deleteEvent() {
    this.confirm.openConfirmDialog('Are you sure want to delete the event?')
      .afterClosed().subscribe(result => {
        if (result) {
          this.eventService.deleteEvent(this.eventId);
          this.snackBarService.showMessageWithDuration('Event deleted', '', 3000);
        }
      })
  }

  //
  // COMMENT SECTION
  //

  showCommentInputArea() {
    this.commentInputArea = !this.commentInputArea;
  }

  add_Comment() {

    if (this.commentForm.invalid) {
      return;
    }
    this.commentService.addComment(this.commentForm.value.content, this.eventId);
    this.commentForm.reset();

    setTimeout(() => this.updateComment(), 1000)
    

  }

  updateComment() {
    this.datasource.adapter.reload(1);
  }

  likeEvent() {
    this.checkForLikeExistence();

    if (!this.containsLike) {
      this.eventService.eventLikeSwitcher(this.eventId);
      this.snackBarService.showMessageWithDuration('Event liked', '', 3000);
    } else {
      this.eventService.eventLikeSwitcher(this.eventId);
      this.snackBarService.showMessageWithDuration('Event dislaiked', '', 3000);
    }

  }

  takePart() {

    if (!this.containsEvent) {
      this.snackBarService.showMessageWithDuration('Event added to attempts', '', 3000);
    } else {
      this.snackBarService.showMessageWithDuration('Event removed from attempts', '', 3000);
    }

    this.eventService.participateAtEvent(this.eventId);
    this.checkForAttemptExistence();
  }

  checkForLikeExistence() {
    this.containsLike = this.event.likes.includes(this.userId);
  }

  checkForAttemptExistence() {
    this.containsEvent = this.event.runners.includes(this.userId);
  }

}
