import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { PageEvent } from "@angular/material";
import { EventModule } from '../../models/event.model';
import { Subscription } from 'rxjs';
import { mimeType } from 'src/app/validators/mime-type.validator';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss',
    './event-list-event-grid.component.scss',
    '../../global-css/global-input.scss'
  ]
})
export class EventsListComponent implements OnInit, OnDestroy {

  searchEventModule = false;

  eventSearchForm: FormGroup;

  userIsAuthenticated = false;

  totalEvents = 0;
  eventsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [2, 5, 10, 20]

  events: EventModule[] = [];
  private eventSub: Subscription;

  distances = [
    {value: '', viewValue: "Clear"},
    {value: 'Couch to 5k', viewValue: 'Couch to 5k'},
    {value: '5K', viewValue: '5K'},
    {value: '10K', viewValue: '10K'},
    {value: 'Half Marathon', viewValue: 'Half Marathon'},
    {value: 'Marathon', viewValue: 'Marathon'},
    {value: 'Mud Run & fun Run', viewValue: 'Mud Run & fun Run'},
    {value: 'Trail', viewValue: 'Trail'},
    {value: 'Walking', viewValue: 'Walking'}
  ]


  constructor(private snackBarService: SnackBarService, private eventService: EventService, private authService: AuthService, private route: Router) { }

  ngOnInit() {

    this.userIsAuthenticated = this.authService.getIsAuth();


    this.eventService.getEventList(this.eventsPerPage, this.currentPage, '', '');

    this.eventSub = this.eventService.getEventUpdateListener()
      .subscribe((value: { events: EventModule[], eventCount: number }) => {
        this.events = value.events;
        this.totalEvents = value.eventCount;
      });

    this.eventSearchForm = new FormGroup({
      'eventDate': new FormControl(''),
      'dist': new FormControl('')
    });

  }

  searchEvent() {

    this.eventService.getEventList(this.eventsPerPage,
                                   this.currentPage,
                                   this.eventSearchForm.value.eventDate,
                                   this.eventSearchForm.value.dist);
  }

  clearSearchBox() {
    this.eventSearchForm.setValue({
      'eventDate': '',
      'dist': ''
    })
  }

  searchEventMenu() {
    this.searchEventModule = !this.searchEventModule;
  }

  openEvent(id: string) {
    if (!this.userIsAuthenticated) {
      this.snackBarService.showMessage('Please login for entering in event!', 'OK');
      return;
    }
    this.route.navigate(['/events/' + id]);
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.eventsPerPage = pageData.pageSize;
    this.eventService.getEventList(this.eventsPerPage, this.currentPage, this.eventSearchForm.value.eventDate, this.eventSearchForm.value.dist);
  }




  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

}
