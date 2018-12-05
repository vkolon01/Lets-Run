import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LoginComponent } from "./login/login.component";
import { SigninComponent } from "./signin/signin.component";

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "signup", component: SigninComponent },

]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
