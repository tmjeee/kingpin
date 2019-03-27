import expressJs, {Request, Response} from "express";
import http, {Server as HttpServer}  from "http";
import {Express} from "express-serve-static-core";
import ws, {Server as WssServer} from "ws";
import {App} from "./app";
import {MysqlDb} from "./mysqldb";


const mysqlDb:MysqlDb = new MysqlDb();
const express:Express = expressJs();
const httpServer:HttpServer = new http.Server(express);
const wss:WssServer = new ws.Server({
  server: httpServer
});

const app:App = new App(express, httpServer, wss, mysqlDb);
app.start();



