import {Express} from "express-serve-static-core";
import {Server as HttpServer} from "http";
import ws, {Server as WssServer} from "ws";
import {RestHandler} from "./rest-handler";
import {WsHandler} from "./ws-handler";
import {MysqlDb} from "./mysqldb";

export class App {

  allWs:ws[];

  restHandler:RestHandler;
  wsHandler:WsHandler;


  constructor(private express:Express,
              private httpServer:HttpServer,
              private wss:WssServer,
              private mysqlDb:MysqlDb) {
    this.allWs = [];
    this.restHandler = new RestHandler(express, mysqlDb);
    this.wsHandler = new WsHandler(wss, mysqlDb);
  }

  start() {
    this.mysqlDb.start();
    this.restHandler.start();
    this.wsHandler.start();

    this.httpServer.listen(8080, ()=>{
      console.log("listening at *:8080");
    });
  }
}