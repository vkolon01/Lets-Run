import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { UserModel } from 'src/app/models/user.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss']
})
export class UserPageComponent implements OnInit {


  user: UserModel;
  user_id: string;
  private userSubscription: Subscription;


  constructor(public userService: UserService, private activeRoute: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() {

    this.activeRoute.paramMap.subscribe((paramMap: ParamMap) => {

      this.user_id = paramMap.get('user_id');

        this.userService.getUserInfo(this.user_id)
        .subscribe(userData => {
          this.user = {
                email: userData.user.email,
                username: userData.user.username,
                avatar: userData.user.imagePath,
                firstName: userData.user.firstName,
                lastName: userData.user.lastName,
                createdAt: userData.user.createdAt,
                dob: userData.user.dob
          }
          console.log(userData)
    })

  })

}

  calculateAge(birthday) { // birthday is a date
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

  UserProfile() {
  }

  deleteUser() {
    this.authService.deleteUser();
  }


}

