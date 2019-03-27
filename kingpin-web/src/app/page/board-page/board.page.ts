import {Component, OnDestroy, OnInit, Provider} from '@angular/core';
import {BoardService} from 'src/app/service/board-service/board.service';
import {Movement, Result, Board, WsServerMessage, WsServerMessage_Reply, WsClientMessage_Init, Player, PlayerShallowCopy} from "kingpin-common/dist/index";
import {ActivatedRoute, Router} from "@angular/router";
import {map} from 'rxjs/operators';
import {AbstractService} from "../../service/abstract.service";
import {MessageService} from "primeng/api";
import {StartupService} from "../../service/startup-service/startup.service";
import {environment} from "../../../environments/environment";
import {SelfService} from "../../service/self-service/self.service";
import {forkJoin} from "rxjs";
import {WsServerMessagesService} from "../../service/ws-server-messages-service/ws-server-messages.service";

export interface Log {

}


@Component({
  templateUrl: './board.page.html',
  styleUrls: ['./board.page.scss'],
  providers:[
    <Provider>{ provide: WsServerMessagesService, useClass: WsServerMessagesService }
  ]
})
export class BoardPage extends AbstractService implements OnInit, OnDestroy {

  myself: Player;
  players: Player[]

  board: Board;
  ready: boolean;
  movement: Movement;


  constructor(private boardService: BoardService,
              private router: Router,
              private selfService: SelfService,
              protected messageService: MessageService,
              protected startupService: StartupService,
              private activatedRoute: ActivatedRoute,
              public wsService: WsServerMessagesService) {
    super(messageService, startupService);
    this.ready = false;
  }

  ngOnInit(): void {
    let myUserId: number = this.selfService.mySelf()._id;
    let boardId: string = this.activatedRoute.snapshot.paramMap.get("boardId");
    this.boardService.getBoard(parseInt(boardId))
      .pipe(
        map((r: Result<Board>) => {
          // handle result
          if (r.status == "success") {
            this.board = r.payload;
          } else {
            super.publish(r);
          }
        }),
        map((r: void) => {
          // find board players & myself
          forkJoin(this.board.players.map((p: PlayerShallowCopy) => {
            return this.boardService.getPlayer(p._id);
          })).pipe(
            map((r: Result<Player>[]) => {
              return r.map((r: Result<Player>) => {
                if (r.status != 'success') {
                  super.publish(r)
                  return;
                }
                return r.payload;
              });
            }),
            map((r: Player[]) => {
              this.players = r;
              this.myself = r.find((p: Player) => p.userId == myUserId);
            })
          ).subscribe()
        }),
        map((r: void) => {
          // wsService init()
          this.wsService.init()
            .then((r: any) => {
              this.wsService.sendInitWsClientMessage(this.board._id, myUserId);
              this.ready = true;
            }).catch((e: any) => {
              console.error(e);
              super.publish(<Result<void>>{
                status: 'error',
                message: e.toString(),
              });
          });
        }),
      ).subscribe();
  }

  ngOnDestroy(): void {
    this.wsService.destroy();
  }


  onChatEvents(msg:string) {
    this.wsService.sendBroadcastWsClientMessage(this.board._id,
      this.myself.name, this.myself.userId, this.myself._id,  msg);
  }






  move() {
    this.movement = this.boardService.movement(this.board);
  }

  confirmation() {
  }

  auction() {
  }

  mortgage() {
  }

  offerSale() {
  }

  acceptSale() {
  }

}
