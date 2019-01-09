import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { UserPageComponent } from "./user-page/user-page.component";
import { UserInfoComponent } from "./user-info/user-info.component";
import { UserFriendsComponent } from "./user-friends/user-friends.component";
import { UserActivetyComponent } from "./user-activety/user-activety.component";
import { ActivateUserComponent } from "./activate-user/activate-user.component";
import { Page404Component } from "../page404/page404.component";

const userRoutes: Routes  = [
    {path: ':user_id', component: UserPageComponent,

    children: [
        {path: 'info', component: UserInfoComponent},
        {path: 'friends', component: UserFriendsComponent},
        {path: 'activity', component: UserActivetyComponent},
        {path: 'activated/:ativation_token', component: ActivateUserComponent},
    ]
}
];

@NgModule({
    imports: [
        RouterModule.forChild(userRoutes)
    ],
    exports: [RouterModule]
})
export class UserRouterModule {}
