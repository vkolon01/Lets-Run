import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material'

import { LoginComponent } from 'src/app/auth/login/login.component';
import { SigninComponent } from 'src/app/auth/signin/signin.component';
import { AddEventComponent } from 'src/app/event/add-event/add-event.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  userId: string;
  username: string;

  constructor(private authService: AuthService,
              private dialog: MatDialog) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userId = this.authService.getUserId();
    this.authListenerSubs = this.authService.getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });


    this.username = this.authService.getUsername();
        

  }

  onLogin() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "80%";
    dialogConfig.height = "50%";

    this.dialog.open(LoginComponent, dialogConfig);
  }

  onRegister() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    dialogConfig.width = "80%";
    dialogConfig.height = "80%";

    this.dialog.open(SigninComponent, dialogConfig);
  }

  onLogOut() {

    this.authService.logout();
  }

  onAddEvent() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "80%";
    dialogConfig.height = "80%";

    this.dialog.open(AddEventComponent, dialogConfig);
  }

  ngOnDestroy(){
    this.authListenerSubs.unsubscribe();
  }



}
