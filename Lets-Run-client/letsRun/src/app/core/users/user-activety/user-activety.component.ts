import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../../models/user.model';
import { ParamMap, ActivatedRoute } from '@angular/router';
import { DialogService } from 'src/app/services/dialogService';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from '../../../services/user.service';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-user-activety',
  templateUrl: './user-activety.component.html',
  styleUrls: ['./user-activety.component.scss']
})
export class UserActivetyComponent implements OnInit {
  user_id: string;
  private userSubscription: Subscription;
  user: UserModel;

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
              })
    })
    }

    checkForEndedStatus(date) {
      let now = moment().format("MMMM DD YYYY");
      let formatedDate = moment(date).format("MMMM DD YYYY");

      if(moment(now).isAfter(formatedDate)) {
        return true;
      }
        return false;
      
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
