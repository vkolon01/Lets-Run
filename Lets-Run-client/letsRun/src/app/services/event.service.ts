import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment"
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { EventModule } from "../models/event.model";
import { Subject, pipe } from "rxjs";
import { map } from "rxjs/operators";
import { SnackBarService } from "./snack-bar.service";



const BACKEND_URL = environment.apiUrl;


@Injectable({ providedIn: "root" })
export class EventService {

    private events: EventModule[] = [];
    maxEvents: number;
    private eventUpdated = new Subject<{ events: EventModule[], eventCount: number }>();

    creatorName: string;
    creatorId: string;
    private creatorNameAndId = new Subject<{ creatorName: string, creatorId: string }>();

    private event: EventModule;
    private eventUpdate = new Subject<{ event: EventModule }>();

    private likes: string[] =[];
    private eventLikeUpdated = new Subject<{ likes: string[] }>();

    constructor(private http: HttpClient, private router: Router,  private snackBarService: SnackBarService) { }

    getEvents() {
        return this.events;
    }

    createEvent(title: string, location: string, distance, pace: string, eventDate, eventTime, desc: string, image: File, privateEvent: string) {

        const newEvent = new FormData();
        newEvent.append("title", title);
        newEvent.append("location", location);
        newEvent.append("pace", pace);
        newEvent.append("eventDate", eventDate);
        newEvent.append("eventTime", eventTime)
        newEvent.append("distance", distance);
        newEvent.append("image", image, location);
        newEvent.append('description', desc);
        newEvent.append('privateEvent', privateEvent);
         this.http.post(BACKEND_URL + '/events/add-event', newEvent).subscribe(
            result => {
                this.snackBarService.showMessageWithDuration('Event added', 'OK', 3000);
                this.eventUpdated.next({
                    events: [...this.events],
                    eventCount: this.maxEvents
                })
                this.getEventList(5, 1, '', '');
            }
        )
    }

    getEventList(eventsPerPage: number, currentPage: number, filterDate: string, filterDist) {
        const queryParams = `?pagesize=${eventsPerPage}&page=${currentPage}&filterDate=${filterDate}&eventDistance=${filterDist}`;
        this.http.get<{ message: string; events: any; maxEvents: number }>(BACKEND_URL + '/events/' + queryParams)
            .pipe(map(eventData => {
                return {
                    events: eventData.events.map(event => {
                        return {
                            id: event._id,
                            title: event.title,
                            location: event.location,
                            distance: event.distance,
                            pace: event.pace,
                            eventDate: event.eventDate,
                            author: event.author,
                            comments: event.comments,
                            picture: event.picture
                        };
                    }),
                    maxEvents: eventData.maxEvents
                };
            })
            )
            .subscribe(events => {
                this.events = events.events;
                this.maxEvents = events.maxEvents;
                this.eventUpdated.next({
                    events: [...this.events],
                    eventCount: events.maxEvents
                })
            });
    }

    getUsersForPrivateEvent(eventId: string) {
        return this.http.get<{invitedUsers: string[]}>(BACKEND_URL + "/events/" + eventId + "/invitedUsers");
    }


    getEventUpdateListener() {
        return this.eventUpdated.asObservable();
    }

    getLikesUpdate() {
        return this.eventLikeUpdated.asObservable();
    }

    getCreatorName() {
        return this.creatorName;
    }

    getCreatorId() {
        console.log(this.creatorId);

        return this.creatorId;
    }

    getEventUpdate() {
        return this.eventUpdate.asObservable();
    }

    getCreatorNameAndId(){
        return this.creatorNameAndId.asObservable();
    }

    getEventForHomeComponent() {
        return this.http.get<{ pastEvents: number; futureEvents: number;}>(BACKEND_URL + '/events/get_event_for_home_component/');
    }

    getEventById(id: string) {
        return this.http.get<{
        eventById: any,
        creatorName: string,
        creatorId: string,

        }>(BACKEND_URL + '/events/' + id)
            .subscribe(event => {

                this.event = event.eventById;
                this.creatorName = event.creatorName;
                this.creatorId = event.creatorId;

                this.creatorNameAndId.next({
                    creatorName: this.creatorName,
                    creatorId: this.creatorId
                });

                this.eventUpdate.next({
                    event: this.event
                });

            }, error => {
                this.router.navigate(['/events']);
                
              });
    }

    updateEvent(id: string, title: string, location: string,distance ,pace: string,eventDate: Date, eventTime: Date ,author: string, description: string, image: File | string, privateEvent: boolean){
        let updatedEvent:  EventModule | FormData;

        if(typeof image === "object") {
            updatedEvent = new FormData();
            updatedEvent.append("id", id);
            updatedEvent.append("title", title);
            updatedEvent.append("location", location);
            updatedEvent.append("pace", pace);
            updatedEvent.append("eventDate", eventDate.toString());
            updatedEvent.append("eventTime", eventTime.toString());
            updatedEvent.append("distance", distance);
            updatedEvent.append("description", description);
            updatedEvent.append("image", image, location);
            updatedEvent.append("privateEvent", privateEvent.toString());

            console.log('image to send like object');
            console.log(updatedEvent.get("id"));
            console.log(updatedEvent.get("title"));
            console.log(updatedEvent.get("location"));
            console.log(updatedEvent.get("pace"));
            console.log(updatedEvent.get("eventDate"));
            console.log(updatedEvent.get("eventTime"));
            console.log(updatedEvent.get("distance"));
            console.log(updatedEvent.get("description"));
            console.log(updatedEvent.get("image"));
            console.log(updatedEvent.get("privateEvent"));
        } else {

            updatedEvent = {
                id: id,
                title: title,
                location: location,
                pace: pace,
                eventDate: eventDate,
                eventTime: eventTime,
                distance: distance,
                description: description,
                picture: image,
                privateEvent: privateEvent
            }
            console.log('image to send like string');
            console.log(updatedEvent);

        }
        this.http.put(BACKEND_URL + '/events/' + id, updatedEvent)
            .subscribe(response => {
                this.snackBarService.showMessageWithDuration('Event updated', 'OK', 3000);
                this.eventUpdate.next({
                    event: this.event
                })
                this.getEventById(id);
            });
    }

    deleteEvent(id: string) {
        console.log('delete ' + id);
        return this.http.delete(BACKEND_URL + '/events/' + id)
                    .subscribe(result => {
                        this.snackBarService.showMessageWithDuration('Event deleted', 'OK', 3000);
                        this.getEventList(5, 1, '', '')
                        this.router.navigate(["/events"]);
                    });
    }

    uploadEventPicture(event_id: string, image: File | string) {
        let avatarData: string | FormData;

          if(typeof image === "object") {
            avatarData = new FormData();
            avatarData.append("image", image, event_id );
          } else {
            return;
          }

          this.http.put(BACKEND_URL + "/events/" + "add_event_picture/" + event_id, avatarData).subscribe(result => { this.getEventById(event_id); });

          }


    sendFriendsInvitesToPrivateEvent(eventId: string, friendsIds: string[]) {

           return this.http.post(BACKEND_URL+ "/events/" + eventId + "/invitesToEvent", friendsIds)
          }

    eventLikeSwitcher(id: string) {
        return this.http.get(BACKEND_URL + '/events/' + id + '/like_event_switcher')
            .subscribe(result => {

                this.getEventById(id);
            });
    }

    participateAtEvent(id: string) {
        return this.http.get(BACKEND_URL + '/events/' + id + '/participate_at_event')
                   .subscribe(result => {
                    this.getEventById(id);
                   });
    }

}
