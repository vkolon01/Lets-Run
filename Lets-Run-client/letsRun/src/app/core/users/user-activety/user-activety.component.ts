import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../../models/user.model';
import { ParamMap, ActivatedRoute } from '@angular/router';
import { DialogService } from 'src/app/services/dialogService';
import { AuthService } from 'src/app/auth/auth.service';
import { UserService } from '../user.service';
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
        
          this.userService.getUserInfo(this.user_id);
  
          this.userSubscription = this.userService.getUserListener()
              .subscribe((value: {user: UserModel}) => {
                this.user = value.user
              })
    })
    }

    checkForEndedStatus(date) {
      let now = moment().format("MMMM DD YYYY");
      let formatedDate = moment(date).format("MMMM DD YYYY");

      // console.log(' ENDED ' + name + '  event date : ' + formatedDate + " and now date : " + now + " State : " + moment(now).isAfter(formatedDate));

      if(moment(now).isAfter(formatedDate)) {
        return true;
      }
        return false;
      
    }

    chekForEventWillBeSoon(date) {
      let last5days = moment(date).subtract(5, 'days').format("MMMM DD YYYY");;
      let now = moment().format("MMMM DD YYYY");
      let formatedDate = moment(date).format("MMMM DD YYYY");
      
      // console.log( 'SOON '  + name + ' event date : ' + formatedDate + "now date : " + now + ' last 5 days ' + last5days + " STATE " + moment(now).isBetween(last5days, formatedDate));
      
      if(moment(now).isBetween(last5days, formatedDate)) {
        return true;
      }
        return false;
      
    }

}
