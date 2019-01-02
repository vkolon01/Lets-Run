import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventModule } from '../../models/event.model';
import { EventService } from '../event.service';
import { CommentService } from '../comment.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription, } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import { Datasource } from 'ngx-ui-scroll';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { DialogService } from 'src/app/services/dialogService';
import * as moment from 'moment';
import { MatDialog, MatDialogConfig } from '@angular/material'
import { AddEventComponent } from '../add-event/add-event.component';

registerLocaleData(localeRu);

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss',
    '../../global-css/global-input.scss'
  ]
})
export class EventDetailComponent implements OnInit {

  eventCreatedAt;
  event: EventModule;
  private eventSub: Subscription;

  eventCreatorName: string;
  creatorId: string;
  private creatorNameAndIdSub: Subscription;

  // comments: CommentModule[] = [];
  eventId: string;

  eventLikes: string[] = [];
  private eventLikeSubscribe: Subscription;
  containsLike: boolean;

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
    private dialog: MatDialog
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
      // debug: true,
      // immediateLog: false
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

      this.eventSub = this.eventService.getEventUpdate()
        .subscribe((value: { event: EventModule }) => {
          this.event = value.event;
          this.eventCreatedAt = moment(this.event.createdAt).fromNow();
          this.checkForLikeExistence();
          this.checkForAttemptExistence();
        });

      this.eventLikeSubscribe = this.eventService.getLikesUpdate()
        .subscribe((value: { likes: string[] }) => {
          this.eventLikes = value.likes
        });

      this.creatorNameAndIdSub = this.eventService.getCreatorNameAndId()
        .subscribe((value: { creatorName: string, creatorId: string }) => {
          this.creatorId = value.creatorId;
          this.eventCreatorName = value.creatorName;
        });

    });
    this.creatorId = this.eventService.getCreatorId();
    this.eventCreatorName = this.eventService.getCreatorName();
  }

  onEventEdit() {

    const eventInfoToUpdate = ({
      id: this.eventId,
      location: this.event.location,
      distance: this.event.distance,
      pace: this.event.pace,
      image: this.event.picture,
      eventDate: this.event.eventDate,
      description: this.event.description
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

    this.updateComment();

  }
  updateComment() {
    this.datasource.adapter.reload(1)
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
