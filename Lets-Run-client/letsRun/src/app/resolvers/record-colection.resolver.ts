import { Injectable } from '@angular/core';

import {Resolve, ActivatedRouteSnapshot} from "@angular/router"
import { EventService } from '../services/event.service';
import { Observable } from 'rxjs';
import { Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class RecordColectionService implements Resolve<any>  {

  constructor(private eventService: EventService, private meta: Meta) {

  }

    resolve(route: ActivatedRouteSnapshot): Observable<any>|Promise<any>|any  {

      this.meta.addTags([
        {name: 'description2', content: 'event resolver '},
        {name: 'author2', content: 'event resolver'},
        {name: 'keywords2', content: 'event resolver, Meta resolver'}
      ]);

      // this.eventService.getEventById(route.paramMap.get('event_id'));

      return  this.eventService.getEventByIdForMeta(route.paramMap.get('event_id'));
  }
}
