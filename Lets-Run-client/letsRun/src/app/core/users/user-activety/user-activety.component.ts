import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../../models/user.model';
import { ParamMap, ActivatedRoute } from '@angular/router';
import { DialogService } from 'src/app/services/dialogService';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from '../../../services/user.service';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { shrinkUpAndDownAnimation, shrinkUpAndDownAnimationField } from 'src/app/animations/animationsUpDown';

@Component({
  selector: 'app-user-activety',
  templateUrl: './user-activety.component.html',  
  styleUrls: ['./user-activety.component.scss'],
  animations: [shrinkUpAndDownAnimationField] 
})
export class UserActivetyComponent implements OnInit {
  user_id: string;
  current_user_id: string;
  private userSubscription: Subscription;
  user: UserModel;
  privatUserInfo: UserModel;

  // createdEvents: boolean = false;
  attemptEvents: boolean = false;

  createdEvents_animation_state = 'up';
  attemptEvents_animation_state = 'up';
  privateCreatedEvents_animation_state = 'up';
  privateEventsInvited_animation_state = 'up';

  privateCreatedEvents: Event[] = [];

   constructor(public userService: UserService,
    private activeRoute: ActivatedRoute,
     private authService: AuthService,
     private confirm: DialogService
     ) { }

     ngOnInit() {

      this.activeRoute.parent.paramMap.subscribe((paramMap: ParamMap) => {
        
        this.user_id = paramMap.get('user_id');
        
          this.userService.getUserInfo(this.user_id, 'eventHistory');
  
          this.userSubscription = this.userService.getUserListener()
              .subscribe((value: {user: UserModel}) => {
                this.user = value.user

                if(this.current_user_id === this.user_id) {
                  this.loadPrivateInfo();
                }
              })



              
        this.current_user_id = this.authService.getUserId()
    })
    }

    loadPrivateInfo() {
      this.userService.getPrivateUserInfo(this.user_id)
      .subscribe(privatInfo => {
        this.privatUserInfo = privatInfo.user;

        console.log('this.privatUserInfo');
        console.log(this.privatUserInfo);
        
      });
    }

    checkForEndedStatus(date) {
      let now = moment().format("MMMM DD YYYY");
      let formatedDate = moment(date).format("MMMM DD YYYY");

      if(moment(now).isAfter(formatedDate)) {
        return true;
      }
        return false;
    }

    show(field: string) {
      console.log(field);
      
      if(field === 'created') {
        this.createdEvents_animation_state = this.createdEvents_animation_state === 'down' ? 'up' : 'down';
      } else if (field === 'attempts') {
        this.attemptEvents_animation_state = this.attemptEvents_animation_state === 'down' ? 'up' : 'down';
      } else if(field === 'privateCreatedEvents') {
        this.privateCreatedEvents_animation_state = this.privateCreatedEvents_animation_state === 'down' ? 'up' : 'down';
      } else if(field === 'privateEventsInvites') {
        this.privateEventsInvited_animation_state = this.privateEventsInvited_animation_state === 'down' ? 'up' : 'down';
      }
      
    }

    chekForEventWillBeSoon(date) {
      let last5days = moment(date).subtract(5, 'days').format("MMMM DD YYYY");;
      let now = moment().format("MMMM DD YYYY");
      let formatedDate = moment(date).format("MMMM DD YYYY");
      
      if(moment(now).isBetween(last5days, formatedDate)) {
        return true;
      }
        return false;
      }

}
