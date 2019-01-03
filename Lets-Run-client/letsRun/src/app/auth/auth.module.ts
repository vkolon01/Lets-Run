import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import { LoginComponent } from "./login/login.component";
import { SigninComponent } from "./signin/signin.component";
import { AuthRoutingModule } from "./auth-routing.module";
import { AngularMaterialModule } from "../angular-material.module";
import { AuthenticateUserComponent } from './authenticate-user/authenticate-user.component';

@NgModule({
  declarations: [AuthenticateUserComponent],
  imports: [CommonModule,  ReactiveFormsModule, AuthRoutingModule, AngularMaterialModule]
})
export class AuthModule {}
