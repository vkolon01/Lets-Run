import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FooterComponent } from "./core/footer/footer.component";
import { HeaderComponent } from "./core/header/header.component";
import { HomeComponent } from './core/home/home.component';
import { UserPageComponent } from "./core/users/user-page/user-page.component";
import { EventDetailComponent } from "./event/event-detail/event-detail.component";
import { ReactiveFormsModule } from "@angular/forms";
import { CommentComponent } from "./event/comment/comment.component";
import { ErrorComponent } from "./core/error/error.component";
import { UiScrollModule } from 'ngx-ui-scroll';
import { AngularMaterialModule } from "./angular-material.module";
import { MatNativeDateModule } from "@angular/material";
import { Page404Component } from "./core/page404/page404.component";
import { GoogleMapComponent } from "./event/google-map/google-map.component";
import { GooglePlacesDirective } from "./directives/google-palces.directive";


@NgModule({
    declarations: [FooterComponent, HeaderComponent, HomeComponent, EventDetailComponent, CommentComponent, Page404Component,GoogleMapComponent, GooglePlacesDirective],
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        UiScrollModule,
        AngularMaterialModule
    ],
    exports: [FooterComponent, HeaderComponent, HomeComponent, EventDetailComponent, CommentComponent, Page404Component,GoogleMapComponent, GooglePlacesDirective]
})

export class CoreModule {}