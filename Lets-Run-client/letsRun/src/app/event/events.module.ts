import { NgModule } from "@angular/core";
import { EventsListComponent } from "./events-list/events-list.component";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { EventsRouterModule } from "./events-router.module";
import { ReactiveFormsModule } from "@angular/forms";
import { AngularMaterialModule } from "../angular-material.module";
import { UiScrollModule } from 'ngx-ui-scroll';
import { GoogleMapComponent } from "./google-map/google-map.component";

@NgModule({
    declarations: [EventsListComponent],
    imports: [
        CommonModule,
        EventsRouterModule,
        ReactiveFormsModule,
        AngularMaterialModule,
    ],
    exports: [EventsListComponent]
})

export class EventsModule {}