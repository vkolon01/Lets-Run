import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { NgModule } from '@angular/core';
    import { BrowserModule , BrowserTransferStateModule} from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './core/error/error.component';
import { MatConfirmDialogComponent } from './mat-confirm-dialog/mat-confirm-dialog.component';
import { AddEventComponent } from './event/add-event/add-event.component';
import { SigninComponent } from './auth/signin/signin.component';
import { LoginComponent } from './auth/login/login.component';
    
    @NgModule({
 bootstrap: [AppComponent],

        imports:[
 BrowserModule.withServerTransition({appId: 'app-root'}),
 
 BrowserTransferStateModule,
 
 AppModule,
 
        ]
       //  ,
       //  providers: [
       //    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
       //    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
       //  ],
       //  entryComponents: [ErrorComponent, MatConfirmDialogComponent, LoginComponent, SigninComponent, AddEventComponent]
    })
    export class AppBrowserModule {}
    