import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LoginComponent } from "./login/login.component";
import { SigninComponent } from "./signin/signin.component";
import { AuthenticateUserComponent } from "./authenticate-user/authenticate-user.component";

const routes: Routes = [
  { path: ":authToken", component: AuthenticateUserComponent }

]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
