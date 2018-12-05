import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EventService } from '../event.service';
import { EventsModule } from '../events.module';
import { EventModule } from '../event.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss']
})
export class EventsListComponent implements OnInit, OnDestroy {

  addEventModule = false;
  eventForm: FormGroup;
  events: EventModule[] = [];
  private eventSub: Subscription;

  constructor(private eventService: EventService) { }

  ngOnInit() {
    this.eventForm = new FormGroup({
      'location': new FormControl(null, {validators: [Validators.required]}),
      'distance': new FormControl(null, {validators: [Validators.required]}),
      'pace': new FormControl(null, {validators: [Validators.required]}),
      'picture': new FormControl(null),
      'eventDate': new FormControl(null, {validators: [Validators.required]}),
    });
    this.eventService.getEventList();

    this.eventSub = this.eventService.getEventUpdateListener()
        .subscribe((value: {events: EventModule[]}) => {
          this.events = value.events;
        });
    console.log(this.events[0]);
    
  }

  // ngOnChanges() {
  //   this.eventSub = this.eventService.getEventUpdateListener()
  //   .subscribe((value: {events: EventModule[]}) => {
  //     this.events = value.events;
  //   });
  // }

  addEventMenu() {
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
    )

  }

  ngOnDestroy() {
    this.eventSub.unsubscribe();
  }

}
