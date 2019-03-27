import {Avatar, MysqlDb} from "./mysqldb";
import {Express, Request, Response, NextFunction, RequestHandler} from "express-serve-static-core";
import {COOKIE_JWT_TOKEN, HTTP_HEADER_JWT_TOKEN, items, Player, BoardListings, BoardListing} from "kingpin-common";
import {User, Result, Board} from "kingpin-common";
import multer from "multer";
import jwt from "jwt-simple";
import {jwtDetectionMiddleware, JwtPayload, jwtPayload, restErrorHandler, secret} from "./rest-handler";


export class RestMysqlHandler {

  constructor(private express:Express,
              private mysqlDb:MysqlDb,
              private upload:multer.Instance) {}

  start() {

    // login & registration
    this.express.post("/login", this.login.bind(this));
    this.express.post("/logout", jwtDetectionMiddleware.bind(this), this.logout.bind(this));
    this.express.post("/register", this.register.bind(this));
    this.express.get("/avatar/:userId", this.getUserAvatar.bind(this));

    // profile
    this.express.post("/profile/email", jwtDetectionMiddleware.bind(this), this.updateUserEmail.bind(this));
    this.express.post("/profile/password", jwtDetectionMiddleware.bind(this), this.updateUserPassword.bind(this));
    this.express.post("/profile/avatar", jwtDetectionMiddleware.bind(this), this.upload.single("avatar"), this.updateUserAvatar.bind(this))

    // boards
    this.express.post("/board/create", jwtDetectionMiddleware.bind(this), this.createBoard.bind(this));
    this.express.get("/board/list", jwtDetectionMiddleware.bind(this), this.listBoards.bind(this))
    this.express.post("/board/join", jwtDetectionMiddleware.bind(this), this.joinBoard.bind(this));
    this.express.put("/board", jwtDetectionMiddleware.bind(this), this.updateBoard.bind(this));
    this.express.get("/board/:boardId", jwtDetectionMiddleware.bind(this), this.getBoard.bind(this));

    // player
    this.express.get("/player/:playerId", jwtDetectionMiddleware.bind(this), this.getPlayer.bind(this));
  }

  login(req:Request, res:Response, next:NextFunction) {
    this.mysqlDb.login(req.body.email, req.body.password)
      .then((user:User|undefined)=>{
        if (user) {
          let jwtToken:string = jwt.encode(<JwtPayload>{
            userId: user._id,
            email: user.email,
            name: user.name
          }, secret);
          res.setHeader(HTTP_HEADER_JWT_TOKEN, jwtToken);
          res.cookie(COOKIE_JWT_TOKEN, jwtToken);
          res.send(<Result<User>>{
            status: "success",
            message: `User ${user && user._id} logged in successfully`,
            payload: user
          })
        } else {
          res.send(<Result<void>>{
            status: "error",
            message: `Login failed`,
          });
        }
      }).catch(restErrorHandler(res));
  }
  logout(req:Request, res:Response, next:NextFunction) {
    let cookie:any = req.cookies[COOKIE_JWT_TOKEN];
    if (cookie) {
      res.clearCookie(COOKIE_JWT_TOKEN);
      res.send(<Result<void>>{
        status:'success',
        message:`logged out`
      });
    }
  }
  register(req:Request, res:Response, next:NextFunction) {
    this.mysqlDb.getUserByEmail(req.body.email)
      .then((u:User|undefined)=>{
        if (!u) {
          return this.mysqlDb.insertUser(<User>req.body);
        }
        throw Error(`User with email ${req.body.email} already exists`);
      }).then((user:User)=>{
        res.send(<Result<User>>{
          status: "success",
          message: `User ${user._id} added successfully`,
          payload: user
        });
      }).catch(restErrorHandler(res));
  }
  createBoard(req:Request, res:Response, next:NextFunction){
    console.log("***** payload", jwtPayload(res));
    this.mysqlDb.insertBoard(
      {
              name: req.body.name,
              start: false,
              description: req.body.description,
              ownerId: jwtPayload(res).userId
      }).then((board:Board)=>{
        res.send(<Result<Board>>{
          status: "success",
          message: `Board ${board._id} added successfully`,
          payload: board
        });
      }).catch(restErrorHandler(res));
  }
  getBoard(req:Request, res:Response, next:NextFunction){
    this.mysqlDb.getBoard(req.params["boardId"])
      .then((board:Board)=>{
        res.send(<Result<Board>>{
          status: "success",
          message:`Board obtained`,
          payload: board
        });
      }).catch(restErrorHandler(res));
  }
  getPlayer(req:Request, res:Response, next:NextFunction) {
    this.mysqlDb.getPlayer(req.params["playerId"])
      .then((player:Player)=>{
        res.send(<Result<Player>>{
          status: 'success',
          message: 'Player retrieved',
          payload: player
        })
      }).catch(restErrorHandler(res));
  }
  updateUserEmail(req:Request, res:Response, next:NextFunction) {
    let _jwtPayload:JwtPayload = jwtPayload(res);
    this.mysqlDb.updateUserEmail(_jwtPayload.userId, req.body.email)
      .then((u:User)=>{
        res.send(<Result<User>> {
          status: 'success',
          message:' user email updated',
          payload: u
        });
      }).catch(restErrorHandler(res));
  }
  updateUserPassword(req:Request, res:Response, next:NextFunction){
    let _jwtPayload:JwtPayload = jwtPayload(res);
    this.mysqlDb.updateUserPassword(_jwtPayload.userId, req.body.password)
      .then((u:User)=>{
        res.send(<Result<User>>{
          status:'success',
          message: `Password for user ${u._id} updated`,
          payload: u
        });
      }).catch(restErrorHandler(res));
  }
  updateUserAvatar(req:Request, res:Response, next:NextFunction){
    let _jwtPayload:JwtPayload = jwtPayload(res);
    let f:Express.Multer.File = req.file;
    this.mysqlDb.updateUserAvatar(_jwtPayload.userId, f.mimetype, f.buffer)
      .then((u:User)=>{
        res.send(<Result<User>>{
          status:'success',
          message: `avatar for user ${u._id} updated`,
          payload: u
        });
      }).catch(restErrorHandler(res));
  }
  listBoards(req:Request, res:Response, next:NextFunction){
    this.mysqlDb.listBoards()
      .then((boards:BoardListings)=>{
        res.send(<Result<BoardListings>>{
          status:'success',
          message: `boards retrieved`,
          payload:boards
        });
      }).catch(restErrorHandler(res));
  }
  joinBoard(req:Request, res:Response, next:NextFunction){
    let _jwtPayload:JwtPayload = jwtPayload(res);
    this.mysqlDb.joinBoard(_jwtPayload.userId, req.body.boardId)
      .then((board:Board)=>{
        res.send(<Result<Board>>{
          status:'success',
          message: ` user ${_jwtPayload.userId} join board ${req.body.boardId}`,
          payload:board
        });
      }).catch(restErrorHandler(res));
  }
  updateBoard(req:Request, res:Response, next:NextFunction){
    this.mysqlDb.updateBoard(req.body.board)
      .then((b:Board)=>{
        res.send(<Result<Board>>{
          status:'success',
          message: ` board ${req.body.boardId} updated`,
          payload:b
        });
      }).catch(restErrorHandler(res));
  }
  getUserAvatar(req:Request, res:Response, next:NextFunction){
    this.mysqlDb.getAvatar(req.params["userId"])
      .then((avatar:Avatar)=>{
        res.setHeader('content-type', avatar.mimeType);
        res.setHeader('content-length', avatar.size);
        res.write(avatar.avatar, 'binary');
        res.end();
      }).catch((e:Error)=> {
        console.error(e);
        res.status(500);
        res.end();
      });
  }
}