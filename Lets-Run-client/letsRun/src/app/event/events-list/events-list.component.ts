import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EventService } from '../event.service';
import { EventsModule } from '../events.module';
import { PageEvent } from "@angular/material";
import { EventModule } from '../event.model';
import { Subscription } from 'rxjs';
import { mimeType } from 'src/app/validators/mime-type.validator';
import { AuthService } from 'src/app/auth/auth.service';
import { Route } from '@angular/compiler/src/core';
import { Routes, Router } from '@angular/router';


@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss']
})
export class EventsListComponent implements OnInit, OnDestroy {

  addEventModule = false;
  eventForm: FormGroup;

  imagePreview: string;
  userIsAuthenticated = false;

  totalEvents = 0;
  eventsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10]
  
  events: EventModule[] = [];
  private eventSub: Subscription;

  constructor(private eventService: EventService, private authService: AuthService, private route: Router) { }

  ngOnInit() {

    this.userIsAuthenticated = this.authService.getIsAuth();

    this.eventForm = new FormGroup({
      'location': new FormControl(null, {validators: [Validators.required]}),
      'distance': new FormControl(null, {validators: [Validators.required]}),
      'pace': new FormControl(null, {validators: [Validators.required]}),
      'image': new FormControl(null, {  asyncValidators: [ mimeType ] }),
      'eventDate': new FormControl(null, {validators: [Validators.required]}),
    }); 
    this.eventService.getEventList(this.eventsPerPage, this.currentPage);

    this.eventSub = this.eventService.getEventUpdateListener()
        .subscribe((value: {events: EventModule[], eventCount: number}) => {
          this.events = value.events;
          this.totalEvents = value.eventCount;
        });
    
  }

  openEvent(id: string) {
    if(!this.userIsAuthenticated) {
      return;
    }
    this.route.navigate(['/events/' + id]);
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.eventsPerPage = pageData.pageSize;
    this.eventService.getEventList(this.eventsPerPage, this.currentPage);
  }

  onImagePicked(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.eventForm.patchValue({image: file});
    this.eventForm.get('image').updateValueAndValidity();
    console.log('event.target');
    console.log(event);
    
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  addEventMenu() {

    if(!this.userIsAuthenticated) {
      return;
    }

    this.addEventModule = !this.addEventModule;
  }

  addEvent(){
    if(this.eventForm.invalid) {
      return;
    }

    this.eventService.createEvent(
      this.eventForm.value.location,
      this.eventForm.value.distance,
      this.eventForm.value.pace,
      this.eventForm.value.eventDate,
      this.eventForm.value.image
    )

    this.eventForm.reset();

    this.addEventMenu();

  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

}
