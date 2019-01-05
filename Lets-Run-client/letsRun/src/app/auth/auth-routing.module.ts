import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LoginComponent } from "./login/login.component";
import { SigninComponent } from "./signin/signin.component";
import { AuthenticateUserComponent } from "./authenticate-user/authenticate-user.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";

const routes: Routes = [
  { path: "resetPassword", component: ResetPasswordComponent },
  { path: "resetPassword/:resetToken", component: ChangePasswordComponent },
  { path: ":authToken", component: AuthenticateUserComponent },
  
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
