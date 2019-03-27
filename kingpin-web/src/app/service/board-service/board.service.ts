import {Injectable} from '@angular/core';
import {
  Item,
  Player,
  Movement,
  Confirmation,
  Result,
  Board,
  PlayerShallowCopy
} from 'kingpin-common/dist/index';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from 'rxjs';

@Injectable()
export class BoardService {

  constructor(private httpClient:HttpClient){ }

  getBoard(boardId: number): Observable<Result<Board>> {
    return this.httpClient.get<Result<Board>>(`${environment.host}board/${boardId}`);
  }

  getPlayer(playerId:number): Observable<Result<Player>> {
    return this.httpClient.get<Result<Player>>(`${environment.host}player/${playerId}`);
  }

  isStreet(item:Item):boolean {
    return (item.type == "street")
  }

  isUtility(item:Item): boolean {
    return (item.type == "utility");
  }

  isStation(item:Item): boolean {
   return (item.type == "station");
  }

  isGo(item:Item): boolean {
    return (item.type == "go");
  }

  isFreeParking(item:Item): boolean {
    return (item.type == "free-parking");
  }

  isPassingOrJail(item:Item): boolean {
    return (item.type == "passing-or-jail");
  }

  isCommunityChess(item:Item): boolean {
    return (item.type == "community-chess");
  }

  isChance(item:Item): boolean {
    return (item.type == "chance");
  }

  isTax (item:Item): boolean {
    return (item.type == "tax");
  }

  isGoToJail(item:Item): boolean {
    return (item.type == "go-to-jail");
  }

  confirmation():Confirmation {
    return null;
  }


  movement(board:Board):Movement {

    let itemIndexCurrentPlayerIsIn:number = Object.values(board.items).findIndex((i:Item)=>{
      let index:number = i.playersOnItem.findIndex((p:PlayerShallowCopy)=>p._id == board.currentPlayer._id);
      return (index >=0)
    });

    let move:number = Math.floor(Math.random()*10+1);
    let playerId:number = board.currentPlayer._id;

    let itemIndexCurrentPlayerMovesTo:number = ((itemIndexCurrentPlayerIsIn + move)%(Object.keys(board.items).length));
    let itemsArray:Item[] = Object.values(board.items);

    let movement:Movement = <Movement> {
      playerId: playerId,
      fromItemId: itemsArray[itemIndexCurrentPlayerIsIn]._id,
      toItemId: itemsArray[itemIndexCurrentPlayerMovesTo]._id
    };


    let indexOfCurrentPlayer:number = board.players.findIndex((p:Player)=>{
      return p._id == board.currentPlayer._id
    });
    let nextPlayer:PlayerShallowCopy = board.players[(indexOfCurrentPlayer+1)%(board.players.length)];
    board.currentPlayer = nextPlayer;

    console.log("**** movement", movement);

    return movement;
  }
}
