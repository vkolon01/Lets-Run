import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material'

import { LoginComponent } from 'src/app/auth/login/login.component';
import { SigninComponent } from 'src/app/auth/signin/signin.component';
import { AddEventComponent } from 'src/app/event/add-event/add-event.component';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { navBarAnimationFromLeft } from 'src/app/animations/animationsUpDown';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [navBarAnimationFromLeft]
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  userId:                   string;
  username:                 string;
  private usernameSub:      Subscription;
  private userIdSub:        Subscription;
  animation_state_1st = 'horizontal';
  animation_state_3d  = 'horizontal';

  constructor(private authService: AuthService,
              private dialog: MatDialog)
              {
                this.usernameSub = this.authService.getUserNameListener().subscribe(result => {
                  this.username = result;
                });
                this.userIdSub = this.authService.getUserIdListener().subscribe(result => {
                  this.userId = result;
                })
              }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userIdSub = this.authService.getUserIdListener().subscribe(result => {
      this.userId = result;
    })
    this.authListenerSubs = this.authService.getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });

    this.usernameSub = this.authService.getUserNameListener().subscribe(result => {
      this.username = result;
    });
  }

  toggle_animation_state(){
    this.animation_state_1st = this.animation_state_1st === 'atAngel' ? 'horizontal' : 'atAngel';
    this.animation_state_3d = this.animation_state_3d   === 'atAngel' ? 'horizontal' : 'atAngel';   
  }


  onLogin() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "80%";
    dialogConfig.height = "50%";

    this.dialog.open(LoginComponent, dialogConfig);
    this.usernameSub = this.authService.getUserNameListener().subscribe(result => {
      this.username = result;
    });
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
    this.usernameSub.unsubscribe();
    this.userIdSub.unsubscribe();
  }



}
