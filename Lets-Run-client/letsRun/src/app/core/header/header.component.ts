import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  userId: string;
  private userIdSub: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userId = this.authService.getUserId();

    this.authListenerSubs = this.authService.getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });

    this.userIdSub = this.authService.getUserIdListener()
        .subscribe(userId => {
          this.userId = userId;
        })
  }

  // ngOnChanges() {
  //   this.userIdSub = this.authService.getUserIdListener()
  //   .subscribe(userId => {
  //     this.userId = userId;
  //   })

  // }
  onLogOut() {

    this.authService.logout();
  }

  ngOnDestroy(){
    this.authListenerSubs.unsubscribe();
    this.userIdSub.unsubscribe();
  }



}
