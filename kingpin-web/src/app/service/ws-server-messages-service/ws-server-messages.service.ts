import {Injectable} from "@angular/core";
import {Observer, ReplaySubject, Subscription} from "rxjs";
import {WsServerMessage_Reply, WsClientMessage_Init, WsServerMessage, WsClientMessage_Broadcast,
  WsServerMessage_Broadcast} from 'kingpin-common';
import {Message} from "primeng/api";
import {environment} from "../../../environments/environment";
import Q from "q";


export interface WsReplyMessage extends Message {
  date?:Date;
}

export interface WsBroadcastMessage extends Message {
  date?:Date;
  name:string;
  message:string;
}

@Injectable()
export class WsServerMessagesService {

  subjectReply:ReplaySubject<WsReplyMessage>;
  subjectBroadcast:ReplaySubject<WsBroadcastMessage>;

  ws:WebSocket;

  constructor() {
    this.subjectReply = new ReplaySubject(10);
    this.subjectBroadcast = new ReplaySubject(10);
  }

  init():Q.Promise<void> {
    let deferred:Q.Deferred<void> = Q.defer();

    // ws - initiate comms
    this.ws = new WebSocket(environment.wsHost);
    this.ws.addEventListener('open', (event:Event)=>{
      console.log("open", event);
      deferred.resolve();
    });
    this.ws.addEventListener('message', (event:MessageEvent)=>{
      console.log("message", event);
      let w:WsServerMessage = <WsServerMessage>JSON.parse(event.data);
      switch(w.type) {
        case "reply":
          this.handleReplyWsServerMessage(<WsServerMessage_Reply>w);
          break;
        case "broadcast":
          this.handleBroadcastWsServerMessage(<WsServerMessage_Broadcast>w);
          break;
      }
    });
    this.ws.addEventListener('error', (event:Event)=>{
      console.log("error", event);
      deferred.reject(event);
    });
    this.ws.addEventListener('close', (event:CloseEvent)=>{
      console.log("close", event);
      deferred.reject(event);
    });

    return deferred.promise;
  }

  destroy() {
    this.ws.close();
  }

  sendInitWsClientMessage(boardId:number, userId:number) {
    console.log("send WsClientMessage_Init");
    this.ws.send(JSON.stringify(<WsClientMessage_Init> {
      type:"init",
      boardId: boardId,
      userId: userId
    }));
  }

  sendBroadcastWsClientMessage(boardId:number, name:string, userId:number, playerId:number, message:string) {
    console.log("send WsClientMessage_Broadcast");
    this.ws.send(JSON.stringify(<WsClientMessage_Broadcast>{
      type:'broadcast',
      boardId: boardId,
      name: name,
      userId: userId,
      playerId: playerId,
      message: message
    }));
  }

  handleReplyWsServerMessage(wsReply:WsServerMessage_Reply) {
    console.log("handleReplyWsServerMessage");
    //super.publishWsReply(r)
    this.subjectReply.next(<WsReplyMessage>{
      severity: wsReply.status,
      summary: wsReply.status,
      detail: wsReply.message,
      date: wsReply.date
    });
  }

  handleBroadcastWsServerMessage(wsMsg:WsServerMessage_Broadcast) {
    console.log("handleBroadcastWsServiceMessage");
    this.subjectBroadcast.next(<WsBroadcastMessage>{
      severity: 'info',
      summary: 'info',
      name: wsMsg.name,
      detail: wsMsg.message,
      message: wsMsg.message,
      date: wsMsg.date
    });
  }

}
