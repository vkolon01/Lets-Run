import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EventsListComponent } from "./event/events-list/events-list.component"
import { HomeComponent } from "./core/home/home.component";
import { UserPageComponent } from "./core/users/user-page/user-page.component";
import { EventDetailComponent } from "./event/event-detail/event-detail.component";
import { Page404Component } from "./core/page404/page404.component";
import { AuthGuard } from "./auth/auth.guard";
import { PostListWithDescComponent } from "./forum/forum-item/post-list-with-desc/post-list-with-desc.component";
import { PostDetailComponent } from "./forum/forum-item/post-list-with-desc/post-item/post-detail/post-detail.component";
import { RecordColectionService } from "./resolvers/record-colection.resolver";

const routes: Routes = [
    {path: "", component: HomeComponent},
    {path: 'events', component: EventsListComponent},
    {path: 'forum', loadChildren: './forum/forum.module#ForumModule'},
    {path: 'forum/:forumList_id', component: PostListWithDescComponent},
    {path: 'forum/:forumList_id/:post_id', component: PostDetailComponent},
    {path: "auth", component: EventDetailComponent},
    {path: "userpage",  loadChildren: './core/users/user.module#UserModule', canActivate: [AuthGuard]},
    {path: "events/:event_id", component: EventDetailComponent, canActivate: [AuthGuard]},
    // {path: "events/:event_id", component: EventDetailComponent}, , canActivate: [AuthGuard] , , resolve: {event: RecordColectionService}
    {path: "404", component: Page404Component},
    {path: "**", component: Page404Component}
]

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        initialNavigation: 'enabled'
      })],
    exports: [RouterModule],
    providers: [AuthGuard, RecordColectionService]
})

export class AppRoutingModule{}