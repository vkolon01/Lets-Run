import { NgModule } from "@angular/core";
import { EventsListComponent } from "./events-list/events-list.component";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { EventsRouterModule } from "./events-router.module";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations: [EventsListComponent],
    imports: [
        CommonModule,
        EventsRouterModule,
        ReactiveFormsModule
    ],
    exports: [EventsListComponent]
})

export class EventsModule {}