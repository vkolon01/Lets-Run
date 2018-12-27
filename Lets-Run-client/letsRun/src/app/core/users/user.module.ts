import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { UserInfoComponent } from "./user-info/user-info.component";
import { UserFreindsComponent } from "./user-freinds/user-freinds.component";
import { UserActivetyComponent } from "./user-activety/user-activety.component";
import { UserRouterModule } from "./user-router.module";
import { UserPageComponent } from "./user-page/user-page.component";

@NgModule({
    declarations: [UserPageComponent, UserInfoComponent, UserFreindsComponent, UserActivetyComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        UserRouterModule
    ],
    exports: [UserPageComponent, UserInfoComponent, UserFreindsComponent, UserActivetyComponent]
})

export class UserModule {}