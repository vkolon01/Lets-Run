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
import { SendInvitesComponent } from "./event/send-invites/send-invites.component";
import { PostListWithDescComponent } from "./forum/forum-item/post-list-with-desc/post-list-with-desc.component";
import { PostItemComponent } from "./forum/forum-item/post-list-with-desc/post-item/post-item.component";
import { PostDetailComponent } from "./forum/forum-item/post-list-with-desc/post-item/post-detail/post-detail.component";
import { PostCommentComponent } from "./forum/forum-item/post-list-with-desc/post-item/post-detail/post-comment/post-comment.component";
import { PaginatorComponent } from "./core/paginator/paginator.component";
import { HttpClientModule, HttpClientJsonpModule } from "@angular/common/http";
import { ShareButtonsModule } from "@ngx-share/buttons";


@NgModule({
    declarations: [
        FooterComponent,
        HeaderComponent,
        PaginatorComponent,
        HomeComponent,
        EventDetailComponent,
        PostListWithDescComponent,
        CommentComponent,
        Page404Component,
        GoogleMapComponent,
        GooglePlacesDirective,
        SendInvitesComponent,
        PostItemComponent,
        PostDetailComponent,
        PostCommentComponent,
    ],
    imports: [
        HttpClientModule,       // (Required) For share counts
        HttpClientJsonpModule,  // (Optional) Add if you want tumblr share counts
        ShareButtonsModule.withConfig({
            debug: true
        }),
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        UiScrollModule,
        AngularMaterialModule
    ],
    exports: [FooterComponent,
        HeaderComponent,
        HomeComponent,
        PaginatorComponent,
        EventDetailComponent,
        PostListWithDescComponent,
        CommentComponent,
        Page404Component,
        GoogleMapComponent,
        GooglePlacesDirective,
        SendInvitesComponent,
        PostItemComponent,
        PostDetailComponent,
        PostCommentComponent]
})

export class CoreModule { }