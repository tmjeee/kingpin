import {Component, OnInit} from "@angular/core";
import {BoardListingService} from "../../service/board-listing-service/board-listing.service";
import {BoardListing,BoardListings, Board, Result, PlayerShallowCopy} from "kingpin-common";
import {map} from 'rxjs/operators';
import {StartupService} from "../../service/startup-service/startup.service";
import {AbstractService} from "../../service/abstract.service";
import {MessageService} from 'primeng/api';
import {Router} from '@angular/router';
import {SelfService} from 'src/app/service/self-service/self.service';

export interface Col {
  field:string,
  header:string
};


@Component({
  templateUrl:'./board-listings.page.html',
  styleUrls:['./board-listings.page.scss']
})
export class BoardListingsPage extends AbstractService implements OnInit {

  cols:Col[];
  boardListings:BoardListings;

  ready:boolean = false;

  constructor(private boardListingService:BoardListingService,
              private router:Router,
              private selfService:SelfService,
              protected startupService:StartupService,
              protected messageService:MessageService) {
    super(messageService, startupService);
    this.cols = [
      <Col>{ field:'name', header:'Name' },
      <Col>{ field:'description', header:'Description'},
      <Col>{ field:'creationDate', header:'Creation Date'},
      <Col>{ field:'owner', header:'Owner'},
      <Col>{ field:'players', header:'Player'},
      <Col>{ field:'actions', header:'Actions'}
    ]
  }

  ngOnInit(): void {
    this.boardListingService
      .allBoardListings()
      .pipe(
        map((r:Result<BoardListings>)=>{
          if (r.status != "success") {
            super.publish(r);
          } else {
            this.boardListings = r.payload;
            this.ready = true;

          }
        })
      )
      .subscribe();
  }

  createBoard(event:Event) {
    this.router.navigate(["/user", "create-board"]);
  }

  onJoinBoardClicked(event:Event, boardListing:BoardListing) {
    this.boardListingService.joinBoard(boardListing.boardId)
      .pipe(
        map((r:Result<BoardListing>)=>{
          if (r.status == "success") {
            this.router.navigate(['/user', 'board', boardListing.boardId]);
            return;
          }else {
            super.publish(r);
          }
        })
      )
      .subscribe();

  }

  onViewBoardClicked(event:Event, boardListing:BoardListing) {
    this.router.navigate(["/user", "board", boardListing.boardId]);
  }

  alreadyPlayerOfBoard(boardListing:BoardListing):boolean {
    return  (!!(boardListing.players.filter((p:PlayerShallowCopy)=>p.userId == this.selfService.mySelf()._id)).length);
  }


}
