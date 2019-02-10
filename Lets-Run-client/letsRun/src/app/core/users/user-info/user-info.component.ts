import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialogService';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { AddEventComponent } from 'src/app/event/add-event/add-event.component';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {

  title;

  memberSince;
  age;
  currentUserId;

  user_id: string;

  private userSubscription: Subscription;

  user: UserModel;
  alreadyFriends;

  constructor(public userService: UserService,
    private activeRoute: ActivatedRoute,
    private authService: AuthService,
    private dialog: MatDialog,
    private confirm: DialogService,
    private snackBarService: SnackBarService,
    private titleService: Title
  ) { }

  ngOnInit() {

    this.activeRoute.parent.paramMap.subscribe((paramMap: ParamMap) => {

      this.user_id = paramMap.get('user_id');
      this.currentUserId = this.authService.getUserId();
      this.userService.getUserInfo(this.user_id, '');

      this.userSubscription = this.userService.getUserListener()
        .subscribe((value: { user: UserModel }) => {
          this.user = value.user;
          this.memberSince = moment(this.user.createdAt).fromNow();
          this.age = moment().diff(this.user.dob, 'year');
          this.title = this.user.firstName + " " + this.user.lastName +  " Info Panel";
          this.titleService.setTitle(this.title);
          this.alreadyFriends = this.checkIfAlreadyFriends(value.user.followers, this.currentUserId);
        })
    })
  }

  checkIfAlreadyFriends(followers, currentUserId) {

    // this.snackBarService.showMessageWithDuration('Welcome back ' + this.username + '!', 'OK', 3000);

    if (followers && followers.length > 0) {

      for (let i = 0; i < followers.length; i++) {
        if (followers[i]._id === currentUserId) {
          return true;
        }else if(i == followers.length - 1){
          return false;
        }
      }

    }else{
      return false;
    }

  }

  friendManipulation() {

    if (!this.checkIfAlreadyFriends(this.user.followers, this.currentUserId)) {
      this.snackBarService.showMessageWithDuration('You following ' + this.user.username + '!', 'OK', 3000);
      this.userService.friendManipulating(this.user_id);
    } else {
      this.snackBarService.showMessageWithDuration('You stopped following ' + this.user.username + '!', 'OK', 3000);
      this.userService.friendManipulating(this.user_id);

    }

  }


  deleteUser() {

    this.confirm.openConfirmDialog('Are you sure want to delete the User?')
      .afterClosed().subscribe(result => {
        if (result) {
          this.userService.deleteUser(this.user_id);
        }
      })
  }

}
