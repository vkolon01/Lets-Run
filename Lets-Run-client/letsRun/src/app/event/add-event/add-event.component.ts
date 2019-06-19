import { Component, OnInit, Inject, ViewContainerRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { mimeType } from 'src/app/validators/mime-type.validator';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { EventService } from '../../services/event.service';
import { MatDialogRef } from '@angular/material';
import {MAT_DIALOG_DATA} from '@angular/material';
import * as moment from 'moment';

@Component({ 
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss',
              '../../global-css/global-input.scss'
             ]
})
export class AddEventComponent implements OnInit {

  checked = false;

  mode = "indeterminate"
  pressedAdd = false;
  loaded = false;

  eventForm: FormGroup;
  imagePreview: string;
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

  eventLocation: string;

  constructor(private snackBarService: SnackBarService,
     private eventService: EventService,
     private dialogRef: MatDialogRef<AddEventComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {

    this.eventLocation = "New York";

    this.eventForm = new FormGroup({
      'title': new FormControl(null, { validators: [Validators.required] }),
      'location': new FormControl(null, { validators: [Validators.required] }),
      'distance': new FormControl(null, { validators: [Validators.required] }),
      'pace': new FormControl(null, { validators: [Validators.required] }),
      'image': new FormControl(null, { asyncValidators: [mimeType] }),
      'eventDate': new FormControl(null, { validators: [Validators.required] }),
      'eventTime': new FormControl(null, { validators: [Validators.required] }),
      'description': new FormControl(null),
      'privateEvent': new FormControl(false)
    });
    

    if(this.data) {
      if(this.data.privateEvent === true) {
        this.checked = true;
      } else {
        this.checked = false;
      }
      this.eventForm.setValue({
      title: this.data.title,
      location: this.data.location,
      distance: this.data.distance,
      pace: this.data.pace,
      image: this.data.image,
      eventDate: this.data.eventDate,
      eventTime: this.data.eventTime,
      description: this.data.description,
      privateEvent: this.data.privateEvent
    });

    }

  }

  changed(){
    this.checked = !this.checked;
    if(this.checked) {
      this.eventForm.get('privateEvent').setValue(true);
    } else {
      this.eventForm.get('privateEvent').setValue(false);
    }
  }

  onChanges(event) {
    this.eventForm.get('location').setValue(event);
    this.eventLocation = event;
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.eventForm.patchValue({ image: file });
    this.eventForm.get('image').updateValueAndValidity();
    console.log('event.target');
    console.log(event);

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  addEvent() {
    this.pressedAdd = true;

    if(!this.data) {
      if (this.eventForm.invalid) {
        this.snackBarService.showMessage('Please fill the required fields', 'OK');
        this.pressedAdd = false;
        return;
      }
  
      this.eventService.createEvent(
        this.eventForm.value.title,
        this.eventForm.value.location,
        this.eventForm.value.distance,
        this.eventForm.value.pace,
        this.eventForm.value.eventDate,
        this.eventForm.value.eventTime,
        this.eventForm.value.description,
        this.eventForm.value.image,
        this.eventForm.value.privateEvent
      );
  
      this.eventForm.reset();
      this.onClose();
    } else {
      let imageToSend = this.eventForm.value.image;

      if(!this.eventForm.get('image').valueChanges) {
        imageToSend = this.data.image
      }
      this.eventService.updateEvent(
        this.data.id,
        this.eventForm.value.title,
        this.eventForm.value.location,
        this.eventForm.value.distance,
        this.eventForm.value.pace,
        this.eventForm.value.eventDate,
        this.eventForm.value.eventTime,
        this.eventForm.value.author,
        this.eventForm.value.description,
        imageToSend,
        this.eventForm.value.privateEvent
      );
      
      this.onClose();
    }
  }

  onClose() {
    this.dialogRef.close();
      }

}
