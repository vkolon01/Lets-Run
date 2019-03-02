import { Component, OnInit, OnDestroy, OnChanges, HostListener } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material'
import { ScrollDispatchModule, ScrollDispatcher, CdkScrollable } from '@angular/cdk/scrolling';

import { LoginComponent } from 'src/app/auth/login/login.component';
import { SigninComponent } from 'src/app/auth/signin/signin.component';
import { AddEventComponent } from 'src/app/event/add-event/add-event.component';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { navBarAnimationFromLeft } from 'src/app/animations/animationsUpDown';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss', '../../global-css/global-input.scss'],
  animations: [navBarAnimationFromLeft]
})
export class HeaderComponent implements OnInit, OnDestroy, OnChanges {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  userId:                   string;
  username:                 string;
  private usernameSub:      Subscription;
  private userIdSub:        Subscription;

  animation_state_1st = 'horizontal';
  animation_state_middle  = 'horizontal';
  animation_state_3d  = 'horizontal';
  animation_menu   = 'invisible';
  animation_links  = 'invisible';

  lastPageYscroll = 0;
  pageYscroll = 0;
  showNavbar = false;

  constructor(private authService: AuthService,
              private dialog: MatDialog,
              private scrollDispatcher: ScrollDispatcher)
              {

                this.usernameSub = this.authService.getUserNameListener().subscribe(result => {
                  this.username = result;
                });
                this.userIdSub = this.authService.getUserIdListener().subscribe(result => {
                  this.userId = result;
                })
              }

              // SejimF
              // http://localhost:4200/userpage/5c0852b63955d001780e24f2/info

              // maksoutlook
              // http://localhost:4200/userpage/5c4c6a330576fd26dc801fc5/info

              // RomanSnakes
              //                               /5c252ea23c24a21b0ca8a6ce

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
  
ngOnChanges() {
  this.userIdSub = this.authService.getUserIdListener().subscribe(result => {
    this.userId = result;
  })  
}

  @HostListener('window:scroll', ['$event']) onScrollEvent($event){
    if(this.animation_menu === 'fullWidhth') {
      return;
    }

    this.pageYscroll = window.pageYOffset;

    if(this.pageYscroll > this.lastPageYscroll && window.pageYOffset > 76) {
      this.showNavbar = true;
      this.lastPageYscroll = this.pageYscroll;
    } else {
      
      this.showNavbar = false;
      this.lastPageYscroll = this.pageYscroll;
    }
  }

  toggle_animation_state(){
    this.animation_state_1st = this.animation_state_1st === 'atAngel' ? 'horizontal' : 'atAngel';
    this.animation_state_3d = this.animation_state_3d   === 'atAngel' ? 'horizontal' : 'atAngel';
    this.animation_state_middle = this.animation_state_middle === 'invisible' ? 'horizontal' : 'invisible';
    this.animation_menu = this.animation_menu === 'fullWidhth' ? 'invisible' : 'fullWidhth';

    setTimeout(() => {
      if(this.animation_menu === 'fullWidhth') {
        this.animation_links = 'showed'
      } else {
        this.animation_links = 'invisible';
      }
    }, 100);
  }


  onLogin() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "80%";
    dialogConfig.height = "70%";

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
