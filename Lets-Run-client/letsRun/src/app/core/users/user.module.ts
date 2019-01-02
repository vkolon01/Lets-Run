import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { UserInfoComponent } from "./user-info/user-info.component";
import { UserFriendsComponent } from "./user-friends/user-friends.component";
import { UserActivetyComponent } from "./user-activety/user-activety.component";
import { UserRouterModule } from "./user-router.module";
import { UserPageComponent } from "./user-page/user-page.component";
import { ActivateUserComponent } from "./activate-user/activate-user.component";

@NgModule({
    declarations: [UserPageComponent, UserInfoComponent, UserFriendsComponent, UserActivetyComponent, ActivateUserComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        UserRouterModule
    ],
    exports: [UserPageComponent, UserInfoComponent, UserFriendsComponent, UserActivetyComponent]
})

export class UserModule {}
