import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserModel } from '../../../models/user.model';
import { DialogService } from 'src/app/services/dialogService';
import { AuthService } from 'src/app/services/auth.service'
import { ActivatedRoute, ParamMap } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { shrinkUpAndDownAnimationField } from 'src/app/animations/animationsUpDown';

@Component({
  selector: 'app-user-friends',
  templateUrl: 'user-friends.component.html',
  styleUrls: ['user-friends.component.scss'],
  animations: [shrinkUpAndDownAnimationField] 
})
export class UserFriendsComponent implements OnInit {

  user_id: string;
  private userSubscription: Subscription;
  user: UserModel;

  following_animation_state = 'up';
  followers_animation_state = 'up';


  constructor(public userService: UserService,
    private activeRoute: ActivatedRoute,
     private authService: AuthService,
     private confirm: DialogService
     ) { }

  ngOnInit() {

    this.activeRoute.parent.paramMap.subscribe((paramMap: ParamMap) => {

      this.user_id = paramMap.get('user_id');



        this.userService.getUserInfo(this.user_id, 'friends');

        this.userSubscription = this.userService.getUserListener()
            .subscribe((value: {user: UserModel}) => {
              this.user = value.user;
            })
    })
  }

  show(field: string) {
    
    if(field === 'following') {
      this.following_animation_state = this.following_animation_state === 'down' ? 'up' : 'down';
    } else if (field === 'followers') {
      this.followers_animation_state = this.followers_animation_state === 'down' ? 'up' : 'down';
    }
    
  }

}
