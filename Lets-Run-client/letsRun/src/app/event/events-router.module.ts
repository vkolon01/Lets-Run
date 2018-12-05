import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { EventsListComponent } from "./events-list/events-list.component";
import { EventDetailComponent } from "./event-detail/event-detail.component";

const eventsRoutes: Routes  = [
    {path: '', component: EventsListComponent, 
    // children: [
    //     {path: ':id', component: EventDetailComponent}
    // ]
}
];

@NgModule({
    imports: [
        RouterModule.forChild(eventsRoutes)
    ],
    exports: [RouterModule]
})
export class EventsRouterModule {}