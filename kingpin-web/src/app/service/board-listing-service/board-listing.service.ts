import {Injectable} from '@angular/core';
import {StartupService, Config} from "../startup-service/startup.service";
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Result, BoardListings, BoardListing} from 'kingpin-common';
import {Observable} from 'rxjs';
import {environment} from "../../../environments/environment";

@Injectable()
export class BoardListingService{

  config:Config;
  ready:boolean;

  constructor(private startupService:StartupService,
              private httpClient:HttpClient) {
    this.ready = false;
    this.startupService.observable
      .pipe(
        map((r:Config)=>{
          this.config = r;
          this.ready = true;
        })
      ).subscribe();
  }

  allBoardListings():Observable<Result<BoardListings>> {
    return this.httpClient
      .get<Result<BoardListings>>(`${environment.host}board/list`);
  }

  createBoard(name:string, description:string):Observable<Result<BoardListing>> {
    return this.httpClient
      .post<Result<BoardListing>>(`${environment.host}board/create`,
        {
          name: name,
          description: description
        });
  }

  joinBoard(boardId:number) {
    return this.httpClient
      .post<Result<BoardListing>>(`${environment.host}board/join`,
        {
          boardId: boardId
        });
  }
}
