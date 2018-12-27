import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EventsListComponent } from "./event/events-list/events-list.component"
import { HomeComponent } from "./core/home/home.component";
import { UserPageComponent } from "./core/users/user-page/user-page.component";
import { EventDetailComponent } from "./event/event-detail/event-detail.component";

const routes: Routes = [
    {path: "", component: HomeComponent},
    {path: "userpage",  loadChildren: './core/users/user.module#UserModule'},
    {path: 'events', loadChildren: './event/events.module#EventsModule'},
    {path: "auth", loadChildren: "./auth/auth.module#AuthModule"},
    {path: "events/:event_id", component: EventDetailComponent},

]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],

})

export class AppRoutingModule{}