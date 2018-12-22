import { Injectable } from "@angular/core";
import { MatDialog, MatSnackBar } from "@angular/material";


@Injectable({ providedIn: "root" })
export class SnackBarService {

    constructor( public snackbar: MatSnackBar) {}

    showMessage(message: string, confirm: string) {
        this.snackbar.open(message, confirm);
    }

    showMessageWithDuration(message: string, confirm: string, duration: number) {
        this.snackbar.open(message, confirm, {duration: duration});
    }

}