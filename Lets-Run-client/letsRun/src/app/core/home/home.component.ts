import { Component, OnInit, OnChanges, HostListener } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EventService } from 'src/app/services/event.service';
import { ForumService } from 'src/app/services/forum-main.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../../global-css/global-input.scss', './home.component.scss']
})
export class HomeComponent implements OnInit{

  testForm: FormGroup;
  siteKey = "6Le9lJQUAAAAAIkVAgOTBXjMigvUUutw1KIxlRcy";
  degr: number;
  degInRad;
  inDeg;

  runImage = "../../../assets/14715666_10209412657691030_5374534727499663114_o.jpg"; 
  breathImage = "../../../assets/casey-horner-673341-unsplash.jpg";
  liveImage = "../../../assets/christian-holzinger-800688-unsplash.jpg";

  pastEvents;
  futureEvents;

  topics;
  posts;
  comments;


  constructor(private eventService: EventService, private forumService: ForumService) { }

  ngOnInit() {
    this.countAngle();
    // this.countAngle();
    this.testForm = new FormGroup({
      'recaptcha': new FormControl('', {validators: [Validators.required]})
    })

    this.eventService.getEventForHomeComponent().subscribe(result => {
      this.pastEvents = result.pastEvents,
      this.futureEvents = result.futureEvents;
    })

    this.forumService.getForumInformationForHome().subscribe(result => {
      this.topics = result.topics;
      this.posts = result.posts;
      this.comments = result.comments;
      
    })
  }

  countAngle() {

    let windowWidth = window.innerWidth
    
    let degInRad = Math.asin(100 / windowWidth);

    const inDeg = degInRad * (180 / Math.PI);

    this.degr = inDeg;
  }

  @HostListener('window:resize', ['$event']) onResizeEvent($event){
    this.countAngle();
  }

  onSend() {
    console.log("success");
  }

}
