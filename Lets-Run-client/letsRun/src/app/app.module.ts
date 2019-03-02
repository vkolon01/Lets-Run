import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth-interceptor';
import { EventDetailComponent } from './event/event-detail/event-detail.component';
import { AngularMaterialModule } from './angular-material.module';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxCaptchaModule } from 'ngx-captcha';

import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './core/error/error.component';
import { UiScrollModule } from 'ngx-ui-scroll';
import { MatConfirmDialogComponent } from './mat-confirm-dialog/mat-confirm-dialog.component';
import { LoginComponent } from './auth/login/login.component';
import { SigninComponent } from './auth/signin/signin.component';
import { AddEventComponent } from './event/add-event/add-event.component';
import { ContactUsComponent } from './core/contact-us/contact-us.component';
@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
    MatConfirmDialogComponent,
    LoginComponent,
    SigninComponent,
    AddEventComponent,
    ContactUsComponent
  ],
  imports: [
    BrowserModule,
    AngularMaterialModule,
    AppRoutingModule,
    NgxCaptchaModule,
    CoreModule,
    UiScrollModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent, MatConfirmDialogComponent, LoginComponent, SigninComponent, AddEventComponent, ContactUsComponent]
})
export class AppModule { }
