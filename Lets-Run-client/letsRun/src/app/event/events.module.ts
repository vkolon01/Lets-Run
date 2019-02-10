import { NgModule } from "@angular/core";
import { EventsListComponent } from "./events-list/events-list.component";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { EventsRouterModule } from "./events-router.module";
import { ReactiveFormsModule } from "@angular/forms";
import { AngularMaterialModule } from "../angular-material.module";
import { UiScrollModule } from 'ngx-ui-scroll';
import { GoogleMapComponent } from "./google-map/google-map.component";
import { SendInvitesComponent } from "./send-invites/send-invites.component";
import { CoreModule } from "../core.module";

@NgModule({
    declarations: [EventsListComponent
    ],
    imports: [
        CommonModule,
        EventsRouterModule,
        ReactiveFormsModule,
        AngularMaterialModule,
        CoreModule
        
    ],
    exports: [EventsListComponent]
})

export class EventsModule {}