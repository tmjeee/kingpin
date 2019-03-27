
export type WsClientMessageType = "init"|"broadcast"|"start-game"|"board";

export interface WsClientMessage {
  type: WsClientMessageType;
}


// first message client send to server after connected through websocket
export interface WsClientMessage_Init extends WsClientMessage {
  type: "init";
  boardId:number;
  userId:number;
}

// client broadcast to server requesting that this be broadcast, server will send
// WsServerMessage_Broadcast to all clients in response
export interface WsClientMessage_Broadcast extends WsClientMessage {
  type:"broadcast";
  boardId:number;
  userId:number;
  name:string;
  playerId:number;
  message:string
}

// client send message to server requesting server to start game (only accepted when
// client is owner of board)
export interface WsClientMessage_StartGame extends WsClientMessage {
  type:"start-game";
  playerId:number;
  boardId:number;
}

// client send message to server requesting server for a copy of the board
export interface WsClientMessage_Board extends WsClientMessage {
  type:"board";
  boardId:number;
}



