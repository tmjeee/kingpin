import {Express, Request, Response, NextFunction} from "express-serve-static-core";
import multer from "multer";
import bodyparser from "body-parser";
import {NextHandleFunction} from "connect";
import path from "path";
import expressjs, {RequestHandler} from "express";
import cookieParser from "cookie-parser";
import jwt from "jwt-simple";
import {COOKIE_JWT_TOKEN, HTTP_HEADER_JWT_TOKEN, items, Player, BoardListings, BoardListing} from "kingpin-common";
import {User, Result, Board} from "kingpin-common";
import Q from "q";
import {RestMysqlHandler} from "./rest-mysql-handler";
import {MysqlDb} from "./mysqldb";

export const secret:string = "xxx";
const assetsPath:string = "../assets/";

export interface JwtPayload {
  userId:number;
  email:string;
  name:string;
}

export function corsHeadersMiddleware(req:Request, res:Response, next:NextFunction) {
  res.header("Access-Control-Allow-Origin", req.header("Origin"));
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type,Cookie");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,HEAD");
  res.header("Access-Control-Expose-Headers", "Set-Cookie,X-jwt-token");
  next();
}

export function jwtDetectionMiddleware(req:Request, res:Response, next:NextFunction) {
  let jwtToken:string = req.cookies[COOKIE_JWT_TOKEN];
  try {
    if (!jwtToken) {
      throw Error("Bad jwt payload");
    }
    let jwtPayload:JwtPayload = jwt.decode(jwtToken, secret);
    if (jwtPayload) {
      res.locals.jwtPayload = jwtPayload;
      next();
    } else {
      throw Error("Bad jwt payload");
    }
  }catch(e) {
    res.status(401);
    res.send(<Result<void>>{
      status: "unauthorized",
      message: `Bad Token ${e.toString()}`
    });
  }
}


export function jwtPayload(res:Response):JwtPayload {
  return <JwtPayload>(res.locals.jwtPayload);
}


export function restErrorHandler(res:Response) {
  return (err:Error)=>{
    res.send(<Result<void>>{
      status: "error",
      message: err.toString()
    });
    res.end();
  }
}

export class RestHandler {

  upload:multer.Instance = multer();
  jsonParser:NextHandleFunction = bodyparser.json();
  urlEncodedParser:NextHandleFunction = bodyparser.urlencoded({extended:false});
  cookieParserRequestHandler:RequestHandler = cookieParser();

  restMsqlHandler:RestMysqlHandler;

  constructor(private express:Express,
              private mysqlDb:MysqlDb) {
    this.restMsqlHandler = new RestMysqlHandler(express, mysqlDb, this.upload)
  }

  start() {
    // static assets & middlewares
    var p:string = path.resolve(__dirname, assetsPath);
    this.express.use(expressjs.static(p));
    this.express.use(this.cookieParserRequestHandler);
    this.express.use(this.jsonParser); // text/json
    this.express.use(this.urlEncodedParser); // multipart-urlencoded
    this.express.use(corsHeadersMiddleware.bind(this));

    this.restMsqlHandler.start();

    // global error handling
    this.express.use((err:any, req:Request, res:Response, next:NextFunction)=>{
      console.error(err);
      res.status(500);
      res.send(<Result<void>>{
        status: "error",
        message: err
      });
    });
  }


}
