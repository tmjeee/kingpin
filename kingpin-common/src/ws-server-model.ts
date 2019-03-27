import {Board} from "./domain-model";

export type WsServerMessageType = "reply"|"broadcast"|"system-info"|"board";

export interface WsServerMessage {
  type:WsServerMessageType;
}

// server reply to client after receiving WsClientMessage_Init
export interface WsServerMessage_Reply extends WsServerMessage {
  type: "reply";
  status: "success" | "error" | "info" | "warn" ;
  date:Date;
  message: string | undefined;
}


// server broadcast (chat) to clients after receiving WsClientMessage_Broadcast
export interface WsServerMessage_Broadcast extends WsServerMessage {
  type:"broadcast";
  name:string,
  boardId:number;
  userId:number;
  playerId:number;
}


// server sending system info to clients
export interface WsServerMessage_SystemInfo extends WsServerMessage {
  type:"system-info";
}


// server sending board info to clients
export interface WsServerMessage_Board extends WsServerMessage {
  type:"board";
  board:Board;
}