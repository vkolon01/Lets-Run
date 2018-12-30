import { Component, OnInit, Input } from '@angular/core';
import { UserModel } from '../../../models/user.model';
import { UserService } from '../user.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { DialogService } from 'src/app/services/dialogService';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { SnackBarService } from 'src/app/services/snack-bar.service';
@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {


  memberSince;
  age;
  currentUserId;

  user_id: string;

  private userSubscription: Subscription;

  user: UserModel;
  alreadyFreinds;

  constructor(public userService: UserService,
    private activeRoute: ActivatedRoute,
    private authService: AuthService,
    private confirm: DialogService,
    private snackBarService: SnackBarService
  ) { }

  ngOnInit() {



    this.activeRoute.parent.paramMap.subscribe((paramMap: ParamMap) => {

      this.user_id = paramMap.get('user_id');

      this.currentUserId = this.authService.getUserId();

      this.userService.getUserInfo(this.user_id);

      this.userSubscription = this.userService.getUserListener()
        .subscribe((value: { user: UserModel }) => {
          this.user = value.user,
            this.memberSince = moment(this.user.createdAt).fromNow();
          this.age = moment().diff(this.user.dob, 'year');

          console.log('value.user.followers');

          this.alreadyFreinds = this.checkIfAlreadyFreinds(value.user.followers, this.currentUserId);
        })


    })

  }

  checkIfAlreadyFreinds(followers, currentUserId) {

    // this.snackBarService.showMessageWithDuration('Welcome back ' + this.username + '!', 'OK', 3000);

    if (followers.length < 0) {
      return false;
    }

    for (let i = 0; i < followers.length; i++) {
      if (followers[i]._id === currentUserId) {
        return true;
      }
    }
    return false;
  }




  freindManipulation() {

    if (!this.checkIfAlreadyFreinds(this.user.followers, this.currentUserId)) {
      this.snackBarService.showMessageWithDuration('You following ' + this.user.username + '!', 'OK', 3000);
      this.userService.freindManipulating(this.user_id);
    } else {
      this.snackBarService.showMessageWithDuration('You stopped following ' + this.user.username + '!', 'OK', 3000);
      this.userService.freindManipulating(this.user_id);

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
