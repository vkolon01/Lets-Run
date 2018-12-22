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

import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './core/error/error.component';
import { UiScrollModule } from 'ngx-ui-scroll';
import { MatConfirmDialogComponent } from './mat-confirm-dialog/mat-confirm-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
    MatConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    AngularMaterialModule,
    AppRoutingModule,
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
  entryComponents: [ErrorComponent, MatConfirmDialogComponent]
})
export class AppModule { }
