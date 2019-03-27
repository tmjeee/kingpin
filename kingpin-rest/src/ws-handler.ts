
import ws, {Server as WssServer} from "ws";
import http from "http";
import Q from "q";
import {Board, Player, User, WsClientMessage, WsClientMessage_Init, WsServerMessage_Reply, PlayerShallowCopy,
  WsClientMessage_Broadcast,
  WsServerMessage_Broadcast,
  WsClientMessage_StartGame,
  WsClientMessage_Board} from "kingpin-common";
import {MysqlDb} from "./mysqldb";

export class WsBoard {
  start:boolean=false;
  wsClients:WsPlayer[]=[];
  wsVIewers:WsViewer[]=[];

  constructor(public board:Board) {}

  addWsPlayer(wsPlayer:WsPlayer){
    if (!this.wsClients.find((w:WsPlayer)=>w.player._id == wsPlayer.player._id)) {
      this.wsClients.push(wsPlayer);
    }
  }

  addWsViewer(wsViewer:WsViewer) {
    if (!wsViewer.user) {
      this.wsVIewers.push(wsViewer);
    } else if (
      this.wsVIewers
        .filter((w:WsViewer)=>w.user)
        .find((w:WsViewer)=> {
          if ((!w.user) || (!wsViewer.user)) {
            return false;
          }
          return (w.user._id == wsViewer.user._id);
        })) {
      // viewer not already exists
      this.wsVIewers.push(wsViewer);
    }
  }
}

export interface WsEntity {
  alive:boolean;
  ws:ws;
}
export interface WsPlayer extends WsEntity{
  player:Player;
}

export interface WsViewer extends WsEntity{
  user:User|undefined;
}

export interface WsBoards {
  [boardId:number]:WsBoard;
}

export class WsHandler {

  wsBoards:WsBoards = {};

  constructor(private wss:WssServer,
              private mysqlDb:MysqlDb) {}

  start() {
    this.wss.on("connection", (ws:ws, args:any[])=>{
      console.log("client connection");
      ws.on("close", (code:number, reason:string)=>{
        console.log("client close", code, reason);
        Object.values(this.wsBoards).forEach((b:WsBoard)=>{
          b.wsClients = b.wsClients.filter((p:WsPlayer)=>p.ws != ws);
          b.wsVIewers = b.wsVIewers.filter((v:WsViewer)=>v.ws != ws);
        });
      });
      ws.on("error", (err:Error)=>{
        console.log("client error", err);
      });
      ws.on("upgrade", (m:http.IncomingMessage)=>{
        console.log("client upgrade", m);
      });
      ws.on("message", (data:ws.Data)=>{
        console.log("client message", data);
        let wsClientMessage:WsClientMessage = JSON.parse(<string>data);
        switch(wsClientMessage.type) {
          case "init":
            this.handleWsClientMessage_init(ws,<WsClientMessage_Init>wsClientMessage);
            break;
          case "broadcast":
            this.handleWsClientMessage_broadcast(ws,<WsClientMessage_Broadcast>wsClientMessage);
            break;
          case "start-game":
            this.handleWsClientMessage_startGame(ws, <WsClientMessage_StartGame>wsClientMessage);
            break;
          case "board":
            this.handleWsClientMessage_board(ws, <WsClientMessage_Board>wsClientMessage);
            break;
        }
      });
      ws.on("open", ()=>{
        console.log("client open");
      });
      ws.on("pong", (data:Buffer)=>{
        console.log("client pong",)
      });
      ws.on("unexpected-response", (req:http.ClientRequest, res:http.IncomingMessage)=>{
        console.log("unexpected-response", req, res);
      });
    });

    this.wss.on("close", (ws:ws, args:any[])=>{
      console.log("close", args);
    });

    this.wss.on("error", (ws:ws, err:Error)=>{
      console.log("error", err);
    });

    this.wss.on("headers", (ws:ws, headers:string[], request:http.IncomingMessage)=>{
      console.log("headers");
    });

    this.wss.on("listening", (ws:ws)=>{
      console.log("websocket server listening");
    });
  }

  private broadcast(wsEntities:WsEntity[], msg:any) {
    wsEntities.forEach((ws:WsEntity)=>{
      try {
        ws.ws.send(JSON.stringify(msg));
      }catch(e) {
        console.error(' error while broadcasting message to entity', ws);
      }
    });
  }

  private send(wsEntity:WsEntity, msg:any) {
    try {
      wsEntity.ws.send(JSON.stringify(msg));
    }catch(e) {
      console.error(' error while sending message to entity', ws);
    }
  }

  private handleWsClientMessage_broadcast(ws:ws, wsClientMessage_Broadcast:WsClientMessage_Broadcast) {
    console.log("handleWsClientMessage_broadcast");
    let wsBoard:WsBoard = this.wsBoards[wsClientMessage_Broadcast.boardId];
    let wsEntities:WsEntity[] = (<WsEntity[]>[])
      .concat(wsBoard.wsVIewers)
      .concat(wsBoard.wsClients);

    this.broadcast(wsEntities, <WsServerMessage_Broadcast>{
      type: "broadcast",
      boardId: wsClientMessage_Broadcast.boardId,
      playerId: wsClientMessage_Broadcast.playerId,
      userId: wsClientMessage_Broadcast.userId,
      name: wsClientMessage_Broadcast.name,
      date: new Date(),
      message: wsClientMessage_Broadcast.message
    });
  }


  private handleWsClientMessage_init(ws:ws, wsClientMessage_Init:WsClientMessage_Init) {
    console.log("handleWsClientMessage_Init");
    let boardId:number = wsClientMessage_Init.boardId;
    let userId:number = wsClientMessage_Init.userId;

    Q.fcall(()=>this.wsBoards[boardId])
      .then((wsBoard:WsBoard)=>{
        // handle board
        let _wsBoard:WsBoard = wsBoard;
        if (!_wsBoard) {
          return this.mysqlDb.getBoard(boardId)
            .then((b:Board)=> {
              if (b) {
                _wsBoard = new WsBoard(b);
                this.wsBoards[boardId] = _wsBoard;
                return _wsBoard;
              } else {
                throw <WsServerMessage_Reply>{
                  type:"reply",
                  status:"error",
                  date: new Date(),
                  message: `No Board with ${boardId} found`
                };
              }
            });
        } else {
          return _wsBoard;
        }
      }).then((wsBoard:WsBoard)=>{
        // handle users/ players
        let player: PlayerShallowCopy | undefined =
          wsBoard.board.players.find((p: PlayerShallowCopy) => p.userId == wsClientMessage_Init.userId)
        if (player) {
          wsBoard.addWsPlayer(<WsPlayer>{
            alive: true,
            player: player,
            ws: ws
          });
          throw (<WsServerMessage_Reply>{
            type:"reply",
            status: "info",
            date: new Date(),
            message: `Player ${player._id} joined board ${boardId}`
          });
        } else {
          this.mysqlDb.getUser(userId)
            .then((u: User|undefined) => {
                wsBoard.addWsViewer(<WsViewer>{
                  alive:true,
                  user: u,
                  ws: ws
                });
                console.log("*** getUser");
                throw (<WsServerMessage_Reply>{
                  type:"reply",
                  status: "info",
                  date: new Date(),
                  message: (u ? `User ${u._id} joined board` : ` anonymous user join board`)
                });
            })
        }
      }).catch((r:WsServerMessage_Reply)=>{
        console.log("catch and Send ", r);
        ws.send(JSON.stringify(r));
      });
  }

  private handleWsClientMessage_startGame(ws:ws, wsClientMessage:WsClientMessage_StartGame) {

  }

  private handleWsClientMessage_board(ws:ws, wsClientMessage:WsClientMessage_Board) {

  }
}