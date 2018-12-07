import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment"
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { EventModule } from "./event.model";
import { Subject, pipe } from "rxjs";
import { map } from "rxjs/operators";



const BACKEND_URL = environment.apiUrl;


@Injectable({ providedIn: "root" })
export class EventService {

    private events: EventModule[] = [];
    private eventUpdated = new Subject<{ events: EventModule[] }>();

    constructor(private http: HttpClient, private router: Router) { }

    getEvents() {
        return this.events;
    }

    createEvent(location: string, distance: number, pace: string, eventDate: Date) {
        const newEvent = { location: location, distance: distance, pace: pace, eventDate: eventDate };
         this.http.post(BACKEND_URL + '/events/add-event', newEvent).subscribe(
            result => {
                this.eventUpdated.next({
                    events: [...this.events]
                })
                this.router.navigate(["/events"]);
            }
        )
    }

    getEventList() {
        this.http.get<{ message: string, events: any }>(BACKEND_URL + '/events/')
            .pipe(map(eventData => {
                return {
                    events: eventData.events.map(event => {
                        return {
                            id: event._id,
                            location: event.location,
                            distance: event.distance,
                            pace: event.pace,
                            eventDate: event.eventDate,
                            author: event.author
                        };
                    })
                };
            })
            )
            .subscribe(events => {
                console.log(events.events);
                this.events = events.events;
                this.eventUpdated.next({
                    events: [...this.events]
                })
            });
    }

    getEventUpdateListener() {
        return this.eventUpdated.asObservable();
    }

    getEventById(id: string) {
        return this.http.get<{eventById: {
            _id: string;
            location: string;
            distance: number;
            pace: string;
            eventDate: Date;
            author: string;},
            creatorName: string,
            creatorId: string
        }>(BACKEND_URL + '/events/' + id);
    }

    updateEvent(id: string,location: string,distance: number,pace: string,eventDate: Date,author: string){
        let eventInfo : EventModule;
        eventInfo = {
            id: id,
            location: location,
            distance: distance,
            pace: pace,
            eventDate: eventDate,
            author: author
        }

        this.http.put(BACKEND_URL + '/events/' + id, eventInfo)
            .subscribe(response => {
                this.router.navigate(["/events"]);
            });
    }

    deleteEvent(id: string) {
        return this.http.delete(BACKEND_URL + '/events/' + id).subscribe(result => {
            this.router.navigate(["/events"]);
        });
    }


}