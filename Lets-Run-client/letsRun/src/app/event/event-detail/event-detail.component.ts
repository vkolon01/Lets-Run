import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventModule } from '../event.model';
import { EventService } from '../event.service';
import { CommentService } from '../comment.service';
import { ActivatedRouteSnapshot, ActivatedRoute, ParamMap, Route } from '@angular/router';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommentModule } from 'src/app/models/comment.model';
import { Subscription, Observable } from 'rxjs';
import { log } from 'util';
import { AuthService } from 'src/app/auth/auth.service';
import { mimeType } from 'src/app/validators/mime-type.validator';
import { DatePipe } from '@angular/common'
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import { Datasource } from 'ngx-ui-scroll';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { DialogService } from 'src/app/services/DialogService';
import * as moment from 'moment';

registerLocaleData(localeRu);

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss',
    '../../global-css/global-input.scss'
  ]
})
export class EventDetailComponent implements OnInit, OnDestroy {

  distances = ['Couch to 5k', '5K', '10K', 'Half Marathon', 'Marathon', 'Mud Run & fun Run', 'Trail', 'Walking'];

  imagePreview: string;

  eventCreatedAt;

  event: EventModule;
  private eventSub: Subscription;

  eventCreatorName: string;
  creatorId: string;
  private creatorNameAndIdSub: Subscription;

  // comments: CommentModule[] = [];
  eventId: string;
  hasComments = false;

  eventLikes: string[] = [];
  private eventLikeSubscribe: Subscription;
  containsLike: boolean;

  eventWillAttempt: string[] = [];
  eventWillAttemptSubscribe: Subscription;
  containsEvent: boolean;

  eventPhotoForm: FormGroup;
  eventForm: FormGroup;
  commentForm: FormGroup;

  edit = false;
  editPhoto = false;
  commentInputArea = false;

  userId: string;

  MIN = 1;
  MAX = 1;

  // private commentsSub: Subscription;

  constructor(private eventService: EventService,
    private activeRoute: ActivatedRoute,
    private commentService: CommentService,
    private authService: AuthService,
    private snackBarService: SnackBarService,
    private confirm: DialogService
  ) { }

  datasource = new Datasource({
    get: (index, count, success) => {

      const start = Math.max(this.MIN, index);
      const end = Math.min(index + count - 1, this.MAX);

      return this.commentService.getCommentListFormNgxUiScroll(this.eventId, index, count)
        .subscribe(result => {
          console.log('result');

          console.log(result);
          success(result.comments);

        });
    },
    devSettings: {
      debug: true,
      immediateLog: false
    }
  });

  ngOnInit() {

    this.eventForm = new FormGroup({
      'location': new FormControl(null, { validators: [Validators.required] }),
      'distance': new FormControl(null, { validators: [Validators.required] }),
      'pace': new FormControl(null, { validators: [Validators.required] }),
      'eventDate': new FormControl(null, { validators: [Validators.required] }),
      'description': new FormControl(null, {validators: [Validators.required]}),
    });

    this.eventPhotoForm = new FormGroup({
       image: new FormControl(null, { asyncValidators: [mimeType] })
    });

    this.commentForm = new FormGroup({
      'content': new FormControl(null, { validators: [Validators.required] }),
    });


    this.userId = this.authService.getUserId();

    this.activeRoute.paramMap.subscribe((paramMap: ParamMap) => {

      this.eventId = paramMap.get('event_id');

      this.eventService.getEventById(this.eventId);


      this.eventSub = this.eventService.getEventUpdate()
        .subscribe((value: { event: EventModule }) => {
          this.event = value.event;
         this.eventCreatedAt = moment(this.event.createdAt).fromNow()
          this.checkForLikeExistance();
          this.checkForAttemptExistance();
        })

      this.eventLikeSubscribe = this.eventService.getLikesUpdate()
        .subscribe((value: { likes: string[] }) => {
          this.eventLikes = value.likes
        })

      this.creatorNameAndIdSub = this.eventService.getCreatorNameAndId()
        .subscribe((value: { creatorName: string, creatorId: string }) => {
          this.creatorId = value.creatorId,
            this.eventCreatorName = value.creatorName
        });

    })
    this.creatorId = this.eventService.getCreatorId();
    this.eventCreatorName = this.eventService.getCreatorName();
  }

  //******************************* */
  //       ON IMAGE SELECTED                          
  //********************************* */

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.eventPhotoForm.patchValue({ image: file });
    this.eventPhotoForm.get('image').updateValueAndValidity();
    console.log('event.target');
    console.log(event);

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }



  ngOnDestroy() {
    // this.commentsSub.unsubscribe();
  }

  //******************************* */
  //       OPENS MENU FOR UPDATE                          
  //********************************* */

  update() {
    this.edit = !this.edit;
    this.editPhoto = false;
    this.imagePreview = null;
    let dp = new DatePipe(navigator.language);
    let p = 'y-MM-dd';
    let dtr = dp.transform(this.event.eventDate, p);

    // console.log(this.event.picture);

    this.eventForm.setValue({
      location: this.event.location,
      distance: this.event.distance,
      pace: this.event.pace,
      // image: this.event.picture,
      eventDate: dtr,
      description: this.event.description
    })
  }



  updatePhoto() {
    this.editPhoto = !this.editPhoto;
    this.edit = false;
    this.imagePreview = null;
  }

  //******************************* */
  //       UPDATING EVENT                          
  //********************************* */

  updateEvent() {

    if (this.eventForm.invalid) {
      return;
    }

    this.eventService.updateEvent(
      this.eventId,
      this.eventForm.value.location,
      this.eventForm.value.distance,
      this.eventForm.value.pace,
      this.eventForm.value.eventDate,
      this.eventForm.value.author,
      this.eventForm.value.description
    );

    this.update();
    this.imagePreview = null;
  }

  updateEventPicture() {
    if(this.eventPhotoForm.invalid) {
      return;
    }

    this.eventService.uploadEventPicture(this.eventId, this.eventPhotoForm.value.image);

    this.updatePhoto();
  }

  updateEventPhoto() {
    console.log('change photo');
    
  }

  deleteEvent() {
    // this.eventService.deleteEvent(this.eventId);
    this.confirm.openConfirmDialog('Are you sure want to delete the event?')
      .afterClosed().subscribe(result => {
        // console.log(result);
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
    this.showCommentInputArea()
    this.commentService.addComment(this.commentForm.value.content, this.eventId);
    this.commentForm.reset();

  }

  likeEvent() {
    this.checkForLikeExistance();

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
    this.checkForAttemptExistance();
  }

  checkForLikeExistance() {

    if (this.event.likes.includes(this.userId)) {
      this.containsLike = true;
    } else {
      this.containsLike = false;
    }

  }

  checkForAttemptExistance() {
    console.log(this.event.runners.includes(this.userId));

    if (this.event.runners.includes(this.userId)) {
      this.containsEvent = true;
    } else {
      this.containsEvent = false;
    }

  }

}
