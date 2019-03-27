import {Component} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from "@angular/forms";
import {BoardListingService} from "../../service/board-listing-service/board-listing.service";
import {map} from 'rxjs/operators';
import {Result, BoardListing} from 'kingpin-common';
import {MessageService} from "primeng/api";
import {StartupService} from "../../service/startup-service/startup.service";
import {Router} from '@angular/router';
import {AbstractService} from "../../service/abstract.service";


@Component({
  templateUrl:'./create-board.page.html',
  styleUrls:['./create-board.page.scss']
})
export class CreateBoardPage extends AbstractService {

  formGroup: FormGroup;
  formControlName: FormControl;
  formControlDescription: FormControl;

  constructor(private formBuilder: FormBuilder,
              private router:Router,
              protected messageService:MessageService,
              protected startupService:StartupService,
              private boardListingService:BoardListingService) {
    super(messageService, startupService);
    this.formControlName = formBuilder.control("", [Validators.required]);
    this.formControlDescription = formBuilder.control("", [Validators.required]);
    this.formGroup = formBuilder.group({
      "name": this.formControlName,
      "description": this.formControlDescription
    });
  }


  onSubmit(event: Event) {
    this.boardListingService
      .createBoard(this.formControlName.value, this.formControlDescription.value)
      .pipe(
        map((r:Result<BoardListing>)=>{
          super.publish(r);
        })
      ).subscribe();
  }

  onBackToListings(event:Event) {
    this.router.navigate(["/user", "board-listings"]);
  }
}
