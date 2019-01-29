import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EventsListComponent } from "./event/events-list/events-list.component"
import { HomeComponent } from "./core/home/home.component";
import { UserPageComponent } from "./core/users/user-page/user-page.component";
import { EventDetailComponent } from "./event/event-detail/event-detail.component";
import { Page404Component } from "./core/page404/page404.component";
import { AuthGuard } from "./auth/auth.guard";

const routes: Routes = [
    {path: "", component: HomeComponent},
    {path: 'events', loadChildren: './event/events.module#EventsModule'},
    {path: 'forum', loadChildren: './forum/forum.module#ForumModule'},
    {path: "auth", loadChildren: "./auth/auth.module#AuthModule"},
    {path: "userpage",  loadChildren: './core/users/user.module#UserModule', canActivate: [AuthGuard]},
    {path: "events/:event_id", component: EventDetailComponent, canActivate: [AuthGuard]},
    {path: "404", component: Page404Component},
    {path: "**", component: Page404Component}
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard]
})

export class AppRoutingModule{}