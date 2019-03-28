import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ContactUsComponent } from '../contact-us/contact-us.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  onContactUs() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    if(document.body.clientWidth > 1200) {
      dialogConfig.height = "50%";
      dialogConfig.width = "40%";
    } else {
      dialogConfig.height = "100%";
      dialogConfig.width = "80%";
    }

    this.dialog.open(ContactUsComponent, dialogConfig);

  }

}
