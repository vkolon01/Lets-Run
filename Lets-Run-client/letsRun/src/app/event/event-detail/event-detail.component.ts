import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventModule } from '../event.model';
import { EventService } from '../event.service';
import { CommentService } from '../comment.service';
import { ActivatedRouteSnapshot, ActivatedRoute, ParamMap } from '@angular/router';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommentModule } from 'src/app/models/comment.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss']
})
export class EventDetailComponent implements OnInit, OnDestroy {

  event: EventModule;
  eventCreatorName: string;
  creatorId: string;
  comments: CommentModule[] = [];
  eventId: string;

  eventForm: FormGroup;
  commentForm: FormGroup;

  edit = false;
  commentInputArea = false;

  private commentsSub: Subscription;

  constructor(private eventService: EventService, private activeRoute: ActivatedRoute, private commentService: CommentService) { }


  ngOnInit() {

    this.eventForm = new FormGroup({
      'location': new FormControl(null, {validators: [Validators.required]}),
      'distance': new FormControl(null, {validators: [Validators.required]}),
      'pace': new FormControl(null, {validators: [Validators.required]}),
      'picture': new FormControl(null),
      'eventDate': new FormControl(null, {validators: [Validators.required]}),
    });

    this.commentForm = new FormGroup({
      'content': new FormControl(null, {validators: [Validators.required]}),
    });
    
    this.activeRoute.paramMap.subscribe((paramMap: ParamMap) => {

      this.eventId = paramMap.get('event_id');

      this.eventService.getEventById(this.eventId)
      .subscribe(eventDate => {

        this.event = {
          id: eventDate.eventById._id,
          author: eventDate.eventById.author,
          location: eventDate.eventById.location,
          distance: eventDate.eventById.distance,
          pace: eventDate.eventById.pace,
          eventDate: eventDate.eventById.eventDate
        },
        this.eventCreatorName = eventDate.creatorName;
        this.creatorId = eventDate.creatorId
      })
    })

    this.commentService.getCommentsList(this.eventId);

    this.commentsSub =this.commentService.getUpdateCommentsListener()
        .subscribe((value: {comments: CommentModule[]}) => {
          this.comments = value.comments
        })
    
  } 

  ngOnDestroy() {
    
  }

  // getEventId() {

  // }

  update(){
    this.edit = !this.edit;
  }

  updateEvent() {

    if(this.eventForm.invalid){
      return;
    }

    this.eventService.updateEvent(
      this.eventId,
      this.eventForm.value.location,
      this.eventForm.value.distance,
      this.eventForm.value.pace,
      this.eventForm.value.eventDate,
      this.eventForm.value.author
    );
  }

  deleteEvent(){
    this.eventService.deleteEvent(this.eventId);
  }

//   
// COMMENT SECTION
// 

  showCommentInputArea() {
    this.commentInputArea = !this.commentInputArea;
  }

  add_Comment() {
    if(this.commentForm.invalid){
      return;
    }

    this.commentService.addComment(this.commentForm.value.content, this.eventId);
  }



}
