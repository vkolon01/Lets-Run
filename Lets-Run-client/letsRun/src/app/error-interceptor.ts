import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse
} from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { MatDialog, MatSnackBar } from "@angular/material";
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { ErrorComponent } from "./core/error/error.component";
import { ErrorService } from "./core/error/error.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private dialog: MatDialog, private errorService: ErrorService, public snackbar: MatSnackBar) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = "An unknown error occurred!";
        // console.log('error');
        // console.log(error);

        // if( error.error.data[0].msg ){
        //   detailedMessage = error.error.data[0].msg;
        // }
         if (error.error.message) {
          errorMessage = error.error.message;
        }
        // this.dialog.open(ErrorComponent, {data: {message: errorMessage}});

        this.snackbar.open(errorMessage, 'close');
        // this.errorService.throwError(errorMessage);
        return throwError(error);
      })
    );
  }
}
