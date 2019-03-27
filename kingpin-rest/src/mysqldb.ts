
import mysql, {Pool, FieldInfo, MysqlError, PoolConnection} from "mysql";
import {User, Board, Item, ID_GO, ID_JUST_VISITING_OR_JAIL, items, Player, PlayerShallowCopy, BoardListings,
  BoardListing,
  ItemShallowCopy} from "kingpin-common";
import Q from "q";
import {SHA256} from "crypto-js";
import {MysqldbScript1} from "./mysqldb-script-1";
import fs from "fs";
import path from "path";

export interface Avatar {
  mimeType:string;
  size:number;
  avatar:Buffer;
}

export type OkPacket = {
  fieldCount:number,
  affectedRows:number,
  insertId:number,
  serverStatus:number,
  warningCount:number,
  message:string,
  protocol41:boolean,
  changedRows:number
}

export type RowDataPacket = {
  [columnName:string]:any;
}

export const pool:Pool = mysql.createPool({
  connectionLimit: 5,
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'kingpin',
  debug: false
});

export const logMysqlError=(err:MysqlError)=>{
  if (err) {
    console.log(err);
    //throw err;
  }
}

export const cleanupConnection = (conn:PoolConnection|undefined)=>{
  console.log("cleanup connection", !!conn);
  if (conn) {
    conn.destroy();
    console.log("destroy connection");
  }
}


const QUERY_GET_BOARD =
    `SELECT 
        BOARD.ID AS BOARD_ID, 
        BOARD.NAME AS BOARD_NAME,
        BOARD.START AS BOARD_START,
        BOARD.DESCRIPTION AS BOARD_DESCRIPTION,
        BOARD.CREATION_DATE AS BOARD_CREATION_DATE,
        BOARD.OWNER_ID AS BOARD_OWNER_ID,
        
        CURRENT_PLAYER.ID AS CURRENT_PLAYER_ID,
        CURRENT_PLAYER.USER_ID AS CURRENT_PLAYER_USER_ID,
        CURRENT_PLAYER.CASH AS CURRENT_PLAYER_CASH,
        CURRENT_PLAYER.LANDING_ON_ITEM_ID AS CURRENT_PLAYER_LANDING_ON_ITEM_ID,
        CURRENT_PLAYER.IN_JAIL AS CURRENT_PLAYER_IN_JAIL,
        CURRENT_PLAYER_USER.NAME AS CURRENT_PLAYER_NAME,
        CURRENT_PLAYER_USER.EMAIL AS CURRENT_PLAYER_EMAIL,
        
        PLAYER.ID AS PLAYER_ID,
        PLAYER.USER_ID AS PLAYER_USER_ID,
        PLAYER.CASH AS PLAYER_CASH,
        PLAYER.LANDING_ON_ITEM_ID AS PLAYER_LANDING_ON_ITEM_ID,
        PLAYER.IN_JAIL AS PLAYER_IN_JAIL,
        PLAYER_USER.NAME AS PLAYER_NAME,
        PLAYER_USER.EMAIL AS PLAYER_EMAIL,
        
        ITEM.ID AS ITEM_ID,
        ITEM.TYPE AS ITEM_TYPE,
        ITEM.NAME AS ITEM_NAME,
        ITEM.OWNING_PLAYER_ID AS ITEM_OWNING_PLAYER_ID,
        ITEM_OWNER_USER.NAME AS ITEM_OWNING_PLAYER_NAME,
        ITEM_OWNER_USER.EMAIL AS ITEM_OWNING_PLAYER_EMAIL,
        ITEM.NEXT_ITEM_ID AS ITEM_NEXT_ITEM_ID,
        ITEM.ORDERING AS ITEM_ORDERING,
        ITEM.COLOR AS ITEM_COLOR,
        ITEM.RENT AS ITEM_RENT,
        ITEM.RENT_WITH_COLOR_SET AS ITEM_RENT_WITH_COLOR_SET,
        ITEM.RENT_WITH_1_HOUSE AS ITEM_RENT_WITH_1_HOUSE,
        ITEM.RENT_WITH_2_HOUSE AS ITEM_RENT_WITH_2_HOUSE,
        ITEM.RENT_WITH_3_HOUSE AS ITEM_RENT_WITH_3_HOUSE,
        ITEM.RENT_WITH_4_HOUSE AS ITEM_RENT_WITH_4_HOUSE,
        ITEM.RENT_WITH_HOTEL AS ITEM_RENT_WITH_HOTEL,
        ITEM.HOUSE_COST AS ITEM_HOUSE_COST,
        ITEM.HOTEL_COST AS ITEM_HOTEL_COST,
        ITEM.MORTGAGE_VALUE AS ITEM_MORTGAGE_VALUE,
        ITEM.UNMORTGAGE_VALUE AS ITEM_UNMORTGAGE_VALUE,
        ITEM.MORTGAGE AS ITEM_MORTGAGE,
        ITEM.COST AS ITEM_COST,
        ITEM.HOUSES AS ITEM_HOUSES,
        ITEM.HOTELS AS ITEM_HOTELS,
        ITEM.TAX AS ITEM_TAX,
        
        PLAYER_ON_ITEM.ID AS PLAYER_ID,
        PLAYER_ON_ITEM.USER_ID AS PLAYER_USER_ID,
        PLAYER_ON_ITEM.CASH AS PLAYER_CASH,
        PLAYER_ON_ITEM.LANDING_ON_ITEM_ID AS PLAYER_LANDING_ON_ITEM_ID,
        PLAYER_ON_ITEM.IN_JAIL AS PLAYER_IN_JAIL,
        PLAYER_ON_ITEM_USER.NAME AS PLAYER_NAME,
        PLAYER_ON_ITEM_USER.EMAIL AS PLAYER_EMAIL,
        
        ITEM_OWNER.ID AS ITEM_OWNER_ID,
        ITEM_OWNER.USER_ID AS ITEM_OWNER_USER_ID,
        ITEM_OWNER.CASH AS ITEM_OWNER_CASH,
        ITEM_OWNER.LANDING_ON_ITEM_ID AS ITEM_OWNER_LANDING_ON_ITEM_ID,
        ITEM_OWNER.IN_JAIL AS ITEM_OWNER_IN_JAIL,
        ITEM_OWNER_USER.NAME AS ITEM_OWNER_NAME,
        ITEM_OWNER_USER.EMAIL AS ITEM_OWNER_EMAIL,
        
        PLAYER_ON_ITEM.ID AS PLAYER_ON_ITEM_ID,
        PLAYER_ON_ITEM.USER_ID AS PLAYER_ON_ITEM_USER_ID,
        PLAYER_ON_ITEM.CASH AS PLAYER_ON_ITEM_CASH,
        PLAYER_ON_ITEM.LANDING_ON_ITEM_ID AS PLAYER_ON_ITEM_LANDING_ON_ITEM_ID,
        PLAYER_ON_ITEM.IN_JAIL AS PLAYER_ON_ITEM_IN_JAIL,
        PLAYER_ON_ITEM_USER.NAME AS PLAYER_ON_ITEM_NAME,
        PLAYER_ON_ITEM_USER.EMAIL AS PLAYER_ON_ITEM_EMAIL
        
          FROM BOARD AS BOARD 
             LEFT JOIN PLAYER AS CURRENT_PLAYER ON CURRENT_PLAYER.ID = BOARD.CURRENT_PLAYER_ID
             LEFT JOIN USER AS CURRENT_PLAYER_USER ON CURRENT_PLAYER.USER_ID = CURRENT_PLAYER_USER.ID
             
             LEFT JOIN PLAYER AS PLAYER ON PLAYER.BOARD_ID = BOARD.ID 
             LEFT JOIN USER AS PLAYER_USER ON PLAYER_USER.ID = PLAYER.USER_ID AND PLAYER.BOARD_ID = BOARD.ID
             
             LEFT JOIN ITEM AS ITEM ON ITEM.BOARD_ID = BOARD.ID 
             LEFT JOIN PLAYER AS ITEM_OWNER ON ITEM_OWNER.ID = ITEM.OWNING_PLAYER_ID
             LEFT JOIN USER AS ITEM_OWNER_USER ON ITEM_OWNER.USER_ID = ITEM_OWNER_USER.ID
             
             LEFT JOIN PLAYER AS PLAYER_ON_ITEM ON PLAYER_ON_ITEM.LANDING_ON_ITEM_ID=ITEM.ID AND ITEM.BOARD_ID = BOARD.ID AND PLAYER_ON_ITEM.BOARD_ID = BOARD.ID
             LEFT JOIN USER AS PLAYER_ON_ITEM_USER ON PLAYER_ON_ITEM.USER_ID = PLAYER_ON_ITEM_USER.ID 
             
             WHERE BOARD.ID=?`;

const _reduceRowDataToBoards:(rowData:RowDataPacket[])=>Board[] =(rowData:RowDataPacket)=>{
  let r1:{[boardId:number]:RowDataPacket[]} =
    rowData.reduce((acc:{[boardId:number]:RowDataPacket[]}, rowData:RowDataPacket)=>{
      if (rowData.BOARD_ID && !acc[rowData.BOARD_ID]) {
        acc[rowData.BOARD_ID]=[];
      }
      acc[rowData.BOARD_ID].push(rowData);

      return acc;
    },{});

  let r2:Board[] =
    (<any>Object).values(r1).reduce((acc:Board[], rowData:RowDataPacket[])=>{
      let b:Board = _reduceRowDataToBoard(rowData);
      acc.push(b);
      return acc;
    },[]);

  return r2;
};

const _reduceRowDataToBoard:(rowData:RowDataPacket[])=>Board=(rowData:RowDataPacket)=>{
  let playersInBoard:{[playerId:number]:boolean} = {};
  let itemsInBoard:{[itemId:string]:boolean} = {};
  let itemPlayers:{[itemId:string]:{[playerId:number]:PlayerShallowCopy}}={}
  let itemOwners:{[itemId:string]:PlayerShallowCopy}={};
  let playersInPrison:{[playerId:number]:PlayerShallowCopy} = {};


  let _b:Board = <Board> rowData.reduce((b:Board, r:RowDataPacket)=>{
    b._id || (b._id = r.BOARD_ID);
    b.name || (b.name = r.BOARD_NAME);
    b.start || (b.start = r.BOARD_START);
    b.creationDate || (b.creationDate = r.BOARD_CREATION_DATE);
    b.description || (b.description = r.BOARD_DESCRIPTION);

    // current player
    b.currentPlayer || (b.currentPlayer = <PlayerShallowCopy>{
      _id: r.CURRENT_PLAYER_ID,
      name: r.CURRENT_PLAYER_NAME,
      userId: r.CURRENT_PLAYER_USER_ID,
      cash: r.CURRENT_PLAYER_CASH,
    });

    // players
    if (r.PLAYER_ID && !playersInBoard[r.PLAYER_ID]) {
      playersInBoard[r.PLAYER_ID]=true;
      b.players.push(<PlayerShallowCopy>{
        _id: r.PLAYER_ID,
        name: r.PLAYER_NAME,
        cash: r.PLAYER_CASH,
        userId: r.PLAYER_USER_ID,
      });
    }

    // item owner
    if (r.ITEM_ID && !itemOwners[r.ITEM_ID]) {
      itemOwners[r.ITEM_ID]= <PlayerShallowCopy>{
        _id: r.ITEM_OWNER_ID,
        name: r.ITEM_OWNER_NAME,
        cash: r.ITEM_OWNER_CASH,
        userId: r.ITEM_OWNER_USER_ID
      };
    }

    // item players
    if (r.ITEM_ID && !itemPlayers[r.ITEM_ID]) {
      itemPlayers[r.ITEM_ID] = [];
    }
    if (r.ITEM_ID && r.PLAYER_ON_ITEM_ID && !itemPlayers[r.ITEM_ID][r.PLAYER_ON_ITEM_ID]) {
      itemPlayers[r.ITEM_ID][r.PLAYER_ON_ITEM_ID]=(<PlayerShallowCopy>{
        _id: r.PLAYER_ON_ITEM_ID,
        name: r.PLAYER_ON_ITEM_NAME,
        cash: r.PLAYER_ON_ITEM_CASH,
        userId: r.PLAYER_ON_ITEM_USER_ID,
      });
    }

    // items
    if (r.ITEM_ID && !itemsInBoard[r.ITEM_ID]) {
      itemsInBoard[r.ITEM_ID] = true;
      let item:Item = <Item>{
        _id: r.ITEM_ID,
        type: r.ITEM_TYPE,
        name: r.ITEM_NAME,
        nextItemId: r.ITEM_NEXT_ITEM_ID,
        playersOnItem: [], /////
        playerPassingByItem: undefined,
        color: r.ITEM_COLOR,
        rent: r.ITEM_RENT,
        rentWithColorSet: r.RENT_WITH_COLOR_SET,
        rentWith1House: r.RENT_WITH_1_HOUSE,
        rentWith2House: r.RENT_WITH_2_HOUSE,
        rentWith3House: r.RENT_WITH_3_HOUSE,
        rentWith4House: r.RENT_WITH_4_HOUSE,
        rentWithHotel: r.RENT_WITH_HOTEL,
        houseCost: r.HOUSE_COST,
        hotelCost: r.HOTEL_COST,
        houses: r.HOUSES,
        hotels: r.HOTELS,
        owner: undefined, ///////
        mortgageValue: r.MORTGAGE_VALUE,
        unmortgageValue: r.UNMORTGAGE_VALUE,
        mortgage:r.MORTGAGE,
        cost:r.COST,
        playersInJail:[],
        tax:r.TAX
      }
      b.items[r.ITEM_ID] = item;
    }

    // player in jail
    if (r.PLAYER_IN_JAIL && (!playersInPrison[r.PLAYER_ID])) {
      playersInPrison[r.PLAYER_ID]=<Player>{
        _id: r.PLAYER_ID,
        name: r.PLAYER_NAME,
        cash: r.PLAYER_CASH,
      };
    }

    return b;
  }, <Board><any>{players:[],items:{}});

  // set board's item player
  Object.keys(itemPlayers).forEach((itemId:string)=>{
    let players:Player[] = (<any>Object).values(itemPlayers[itemId]);
    let i:Item = _b.items[itemId];
    i && (i.playersOnItem=players);
  });

  // item's owner
  Object.keys(_b.items).forEach((itemId:string)=>{
    let i:Item = _b.items[itemId];
    i.owner = itemOwners[itemId];
  });

  // players in prison
  _b.items[ID_JUST_VISITING_OR_JAIL].playersInJail=(<any>Object).values(playersInPrison);

  return _b;
}


export class MysqlDb {

  start() {
    new MysqldbScript1().run();
  }


  insertUser(user:User):Q.Promise<User> {
    return Q.ninvoke(pool, "query",
            `INSERT INTO USER (EMAIL, NAME, PASSWORD) VALUES (?, ?, ?)`,
            [user.email, user.name, SHA256(user.password).toString()])
      .spread((okPacket:OkPacket, fieldInfo:FieldInfo[])=> {
        let insertId:string = ''+okPacket.insertId;
        return Q.ninvoke<any>(pool, "query",
          `SELECT ID, EMAIL, NAME FROM USER WHERE ID=?`,
          [insertId])
      }).then((result:RowDataPacket[])=> {
        return Q.Promise<User>((resolve: (user: User) => void) => {
          resolve(<User>{
            _id: result[0][0].ID,
            name: result[0][0].NAME,
            email: result[0][0].EMAIL
          });
        });
      });
  }

  login(email:string,password:string):Q.Promise<User|undefined> {
    return Q.ninvoke<[RowDataPacket[], FieldInfo[]]>(pool, "query",
            `SELECT ID, NAME, EMAIL FROM USER WHERE EMAIL = ? AND PASSWORD = ?`,
            [email, SHA256(password).toString()])
      .then((result:[RowDataPacket[], FieldInfo[]])=>{
        if (result[0].length > 0) {
          return <User>{
            _id: result[0][0].ID,
            email: result[0][0].EMAIL,
            name: result[0][0].NAME,
          }
        } else {
          return undefined;
        }
      });
  }

  getUserByEmail(email:string):Q.Promise<User|undefined> {
    return Q.ninvoke<[RowDataPacket[],FieldInfo[]]>(pool, "query",
            `SELECT ID, NAME, EMAIL FROM USER WHERE EMAIL=?`,
            [email])
      .then((results:[RowDataPacket[],FieldInfo[]])=>{
          if (results[0].length > 0) {
            return <User>{
              _id: results[0][0].ID,
              name: results[0][0].NAME,
              email: results[0][0].EMAIL,
            }
          }else {
            return undefined;
          }
      });
  }

  getPlayer(playerId:number):Q.Promise<Player> {
        return Q.ninvoke<Player>(pool, "query",
            `SELECT 
                  USER.ID AS USER_ID,
                  USER.NAME AS USER_NAME,
                  USER.EMAIL AS USER_EMAIL,
                  PLAYER.ID AS PLAYER_ID,
                  PLAYER.CASH AS PLAYER_CASH,
                  ITEM.ID AS ITEM_ID,
                  ITEM.TYPE AS ITEM_TYPE,
                  ITEM.NAME AS ITEM_NAME,
                  ITEM.ORDERING AS ITEM_ORDERING,
                  ITEM.NEXT_ITEM_ID AS ITEM_NEXT_ITEM_ID,
                  ITEM.COLOR AS ITEM_COLOR,
                  ITEM.RENT AS ITEM_RENT,
                  ITEM.RENT_WITH_COLOR_SET AS ITEM_RENT_WITH_COLOR_SET,
                  ITEM.RENT_WITH_1_HOUSE AS ITEM_RENT_WITH_1_HOUSE,
                  ITEM.RENT_WITH_2_HOUSE AS ITEM_RENT_WITH_2_HOUSE,
                  ITEM.RENT_WITH_3_HOUSE AS ITEM_RENT_WITH_3_HOUSE,
                  ITEM.RENT_WITH_HOTEL AS ITEM_RENT_WITH_HOTEL,
                  ITEM.HOUSE_COST AS ITEM_HOUSE_COST,
                  ITEM.HOTEL_COST AS ITEM_HOTEL_COST,
                  ITEM.MORTGAGE_VALUE AS ITEM_MORTGAGE_VALUE,
                  ITEM.UNMORTGAGE_VALUE AS ITEM_UNMORTGAGE_VALUE,
                  ITEM.COST AS ITEM_COST,
                  ITEM.HOUSES AS ITEM_HOUSES,
                  ITEM.HOTELS AS ITEM_HOTELS,
                  ITEM.TAX AS ITEM_TAX
                FROM PLAYER AS PLAYER 
                LEFT JOIN USER AS USER ON USER.ID = PLAYER.USER_ID
                LEFT JOIN ITEM AS ITEM ON ITEM.OWNING_PLAYER_ID = PLAYER.ID AND PLAYER.BOARD_ID = ITEM.BOARD_ID
                WHERE PLAYER.ID = ? `,
          [playerId])
          .spread((rowData: RowDataPacket[], fieldInfo: FieldInfo[]) => {
            let p: Player = <Player>{};
            let i: ItemShallowCopy[] = [];
            rowData.forEach((r: RowDataPacket) => {
              if (!p._id) {
                p = <Player>{
                  _id: r['PLAYER_ID'],
                  userId: r['USER_ID'],
                  name: r['USER_NAME'],
                  email: r['USER_EMAIL'],
                  cash: r['PLAYER_CASH'],
                  ownedItems: []
                }
              }
              if (r['ITEM_ID']) {
                i.push(<ItemShallowCopy>{
                  _id: r['ITEM_ID'],
                  type: r['ITEM_TYPE'],
                  name: r['ITEM_NAME'],
                  nextItemId: r['ITEM_NEXT_ITEM_ID'],
                  color: r['ITEM_COLOR'],
                  rent: r['ITEM_RENT'],
                  rentWithColorSet: r['ITEM_RENT_WITH_COLOR_SET'],
                  rentWith1House: r['ITEM_RENT_WITH_1_HOUSE'],
                  rentWith2House: r['ITEM_RENT_WITH_2_HOUSE'],
                  rentWith3House: r['ITEM_RENT_WITH_3_HOUSE'],
                  rentWith4House: r['ITEM_RENT_WITH_4_HOUSE'],
                  rentWithHotel: r['ITEM_RENT_WITH_HOTEL'],
                  houses: r['ITEM_HOUSES'],
                  hotels: r['ITEM_HOTELS'],
                  mortgageValue: r['ITEM_MORTGAGE_VALUE'],
                  unmortgageValue: r['ITEM_UNMORTGAGE_VALUE'],
                  cost: r['COST'],
                  tax: r['TAX']
                });
              }
            });
            (p.ownedItems = i);
            return p;
          });
  }

  getUser(userId:number):Q.Promise<User|undefined> {
    return Q.invoke<[any[],FieldInfo[]]>(pool, "query",
            `SELECT ID, NAME, EMAIL FROM USER WHERE ID=?`,
            [userId])
      .then((results:[any[],FieldInfo[]])=>{
        if (results[0].length > 0) {
          return <User> {
            _id: results[0][0].ID,
            name: results[0][0].NAME,
            email: results[0][0].EMAIL,
          }
        } else {
          return undefined;
        }
      });
  }

  updateUserEmail(userId:number, email:string):Q.Promise<User> {
    return Q.ninvoke<[OkPacket,FieldInfo[]]>(pool, "query",
            `UPDATE USER SET EMAIL=? WHERE ID=?`,
            [email, userId])
      .spread((okPacket:OkPacket, fieldInfo:FieldInfo[])=>{
        if (okPacket.affectedRows == 0) {
          throw Error(`User ${userId} not found`);
        }
        return Q.ninvoke<[RowDataPacket[],FieldInfo[]]>(pool, "query",
            `SELECT ID, NAME, EMAIL FROM USER WHERE ID=?`,
            [userId]);
      }).spread((rowData:RowDataPacket[], fieldInfo:FieldInfo[])=>{
        if (rowData.length > 0) {
           return <User> {
             _id: rowData[0].ID,
             name: rowData[0].NAME,
             email: rowData[0].EMAIL,
           }
        }
        throw Error('User ${userId} not found');
      });
  }

  updateUserPassword(userId:number, password:string):Q.Promise<User> {
    return Q.ninvoke<[OkPacket,FieldInfo[]]>(pool, "query",
              `UPDATE USER SET PASSWORD=? WHERE ID=?`,
            [SHA256(password).toString(), userId])
      .spread((okPacket:OkPacket, fieldInfo:FieldInfo[])=>{
        if (okPacket.affectedRows == 0) {
          throw Error(`User ${userId} not found`);
        }
        return Q.ninvoke<[RowDataPacket[], FieldInfo[]]>(pool, "query",
            `SELECT ID, NAME, EMAIL FROM USER WHERE ID=?`,
            [userId]);
      }).then((results:[RowDataPacket[], FieldInfo[]])=>{
        if (results[0].length > 0) {
          return <User>{
            _id: results[0][0].ID,
            name: results[0][0].NAME,
            email: results[0][0].EMAIL,
          }
        }
        throw Error('User ${userId} not found');
      });
  }


  updateUserAvatar(userId:number, mimeType:string, buffer:Buffer):Q.Promise<User> {
    return  Q.ninvoke(pool, "query",
            `SELECT ID FROM AVATAR WHERE USER_ID=?`,
            [userId])
      .spread((rowData:RowDataPacket[], fieldInfo:FieldInfo[])=>{
        if(rowData.length == 0) {
          return Q.ninvoke<[OkPacket, FieldInfo[]]>(pool, "query",
              `INSERT INTO AVATAR(USER_ID, MIME_TYPE, SIZE, AVATAR) VALUES (?, ?, ?, ?)`,
              [userId, mimeType, buffer.byteLength, buffer])
            .then((results:[OkPacket, FieldInfo[]])=>{
              return {
                avatarId: results[0].insertId,
              };
            })
        } else {
          return Q.ninvoke<[OkPacket, FieldInfo[]]>(pool, 'query',
            `UPDATE AVATAR SET MIME_TYPE=?, SIZE=?, AVATAR=? WHERE USER_ID=?`,
            [mimeType, buffer.byteLength, buffer, userId])
            .then((results:[OkPacket, FieldInfo[]])=>{
              return {
                avatarId: results[0].insertId,
              };
            })
        }
      }).then((r:{avatarId:number})=>{
        return Q.ninvoke<[RowDataPacket[], FieldInfo[]]>(pool, "query",
            `SELECT ID, NAME, EMAIL FROM USER WHERE ID=?`,
            [userId])
      }).then((results:[RowDataPacket[], FieldInfo[]])=>{
        if (results[0].length == 0) {
          throw Error(`User ${userId} not found`);
        }
        return <User> {
          _id: results[0][0].ID,
          name: results[0][0].NAME,
          email: results[0][0].EMAIL,
        }
      });
  }

  insertBoard(info:{name:string, start:boolean, description:string, ownerId:number}):Q.Promise<Board> {
    return  Q.ninvoke(pool, 'query',
              `INSERT INTO BOARD (NAME, START, DESCRIPTION, CREATION_DATE, OWNER_ID, CURRENT_PLAYER_ID) VALUES (?,?,?,?,?,?)`,
            [info.name, info.start, info.description, new Date(), info.ownerId, info.ownerId])
      .spread((okPacket:OkPacket, fieldInfo:FieldInfo[])=>{
          if (okPacket.affectedRows == 0) {
            throw Error(`Failed to insert board`);
          }
          let newBoardId:number = okPacket.insertId;

          let all:Q.Promise<any>[] = [];
          (<any>Object).values(items).forEach((i:Item, idx:number)=>{
            let values:any[];
            switch(i.type) {
              case 'street': {
                let _i: Item = <Item>i;
                values = [_i._id, _i.type, _i.name, null, _i.nextItemId, newBoardId, idx, _i.color, _i.rent, _i.rentWithColorSet,
                  _i.rentWith1House, _i.rentWith2House, _i.rentWith3House, _i.rentWith4House, _i.rentWithHotel, _i.houseCost,
                  _i.hotelCost, _i.mortgageValue, _i.unmortgageValue, _i.houses, _i.hotels, _i.mortgage, _i.cost, null];
                break;
              }case 'utility':
               case 'station': {
                 let _i: Item = <Item>i;
                 values = [_i._id, _i.type, _i.name, null, _i.nextItemId, newBoardId, idx, null, null, null,
                   null, null, null, null, null, null,
                   null, _i.mortgageValue, _i.unmortgageValue, null, null, _i.mortgage, _i.cost, null];
                 break;
              }case 'tax': {
                let _i:Item = <Item>i;
                values = [_i._id, _i.type, _i.name, null, _i.nextItemId, newBoardId, idx, null, null, null,
                  null, null, null, null, null, null,
                  null, null, null, null, null, null, null, _i.tax]
                break;
              }default: {
                let _i:Item = i;
                values = [_i._id, _i.type, _i.name, null, _i.nextItemId, newBoardId, idx, null, null, null,
                          null, null, null, null, null, null,
                          null, null, null, null, null, null, null, null]
                break;
              }
            }

            // insert items of boards
            all.push(
              Q.ninvoke(pool, 'query',
                `INSERT INTO ITEM (ID, TYPE, NAME, OWNING_PLAYER_ID, NEXT_ITEM_ID, BOARD_ID, ORDERING, COLOR, RENT, RENT_WITH_COLOR_SET, 
                      RENT_WITH_1_HOUSE, RENT_WITH_2_HOUSE, RENT_WITH_3_HOUSE, RENT_WITH_4_HOUSE, RENT_WITH_HOTEL, HOUSE_COST, 
                      HOTEL_COST, MORTGAGE_VALUE, UNMORTGAGE_VALUE, HOUSES, HOTELS, MORTGAGE, COST, TAX) 
                      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                values)
            );
          });
          return Q.all(all.concat([
            Q.Promise((res)=>res(newBoardId))
          ]));
      }).then((results:([OkPacket, FieldInfo[]]|number)[])=>{
        results.forEach((r:[OkPacket, FieldInfo[]]|number)=>{
          if (this.isArray(r) && r[0].affectedRows == 0)  {
            throw Error(`Item failed insertion`);
          }
        });

        let newBoardId:number = <any>results[results.length-1];

        // insert players
        return Q.all([
          newBoardId,
          Q.ninvoke<[OkPacket, FieldInfo[]]>(pool, "query",
              `INSERT INTO PLAYER (USER_ID, BOARD_ID, CASH, LANDING_ON_ITEM_ID, IN_JAIL) VALUES (?, ?, ?, ?, ?)`,
                    [info.ownerId, newBoardId, 0, ID_GO, 0])
        ]);
      }).spread((boardId:number, results:[OkPacket, FieldInfo[]])=>{
        if (results[0].affectedRows == 0) {
          throw Error("Players insertion failed");
        }
        return this.getBoard(boardId);
      });
  }


  getBoard(boardId: number):Q.Promise<Board> {
    return Q.ninvoke<[RowDataPacket[], FieldInfo[]]>(pool, "query",
          QUERY_GET_BOARD,
          [boardId])
      .spread((rowData:RowDataPacket[], fieldInfo:FieldInfo[])=>{
          return _reduceRowDataToBoard(rowData);
      });
  }

  listBoards():Q.Promise<BoardListings>{
    let total:number=0;
    return Q.ninvoke<number>(pool, 'query',
            `SELECT COUNT(*) AS TOTAL FROM BOARD`, [])
          .spread((results: RowDataPacket[], fieldInfo: FieldInfo[]) => {
            if (results.length <= 0) {
              throw Error('unable to find total boards');
            }
            total = results[0]['TOTAL'];
          })
          .then((r:void)=>{
            return Q.ninvoke<[RowDataPacket[], FieldInfo[]]>(pool, "query",
          `SELECT 
                  BOARD.ID AS BOARD_ID, 
                  BOARD.NAME AS BOARD_NAME, 
                  BOARD.START AS BOARD_START,
                  BOARD.DESCRIPTION AS BOARD_DESCRIPTION, 
                  BOARD.CREATION_DATE AS BOARD_CREATION_DATE,
                  OWNER.ID AS OWNER_ID,
                  OWNER.EMAIL AS OWNER_EMAIL,
                  OWNER.NAME AS OWNER_NAME,
                  PLAYER.ID AS PLAYER_ID,
                  PLAYER_USER.NAME AS PLAYER_NAME,
                  PLAYER.USER_ID AS PLAYER_USER_ID,
                  PLAYER.CASH AS PLAYER_CASH
                FROM (
                  SELECT * FROM BOARD  
                ) AS BOARD 
                LEFT JOIN USER AS OWNER ON OWNER.ID = BOARD.OWNER_ID 
                LEFT JOIN PLAYER AS PLAYER ON PLAYER.BOARD_ID = BOARD.ID
                LEFT JOIN USER AS PLAYER_USER ON PLAYER_USER.ID = PLAYER.USER_ID AND BOARD.ID = PLAYER.BOARD_ID`,
          []);
      }).spread((rowData:RowDataPacket[], fieldInfo:FieldInfo[])=>{
        let boardListings:{[boardId:number]:BoardListing} = {};
        let boardOwner:{[boardId:number]:User} = {};
        let boardPlayers:{[boardId:number]:{[playerId:number]:PlayerShallowCopy}} = {};

        rowData.forEach((r:RowDataPacket)=>{
          let boardId:number = r['BOARD_ID'];
          if (!boardListings[boardId]) {
            boardListings[boardId] = <BoardListing>{
              boardId: boardId,
              name: r['BOARD_NAME'],
              start: r['BOARD_START'],
              description: r['BOARD_DESCRIPTION'],
              creationDate: r['CREATION_DATE'],
            };
          }

          if (!boardOwner[boardId] && r['OWNER_ID']) {
            boardOwner[boardId] = <User> {
              _id: r['OWNER_ID'],
              email: r['OWNER_EMAIL'],
              name: r['OWNER_NAME']
            };
          }

          let playerId:number = r['PLAYER_ID'];
          if (!boardPlayers[boardId]) {
            boardPlayers[boardId] = {};
          }
          if (!boardPlayers[boardId][playerId] && playerId) {
            boardPlayers[boardId][playerId] = <PlayerShallowCopy>{
              _id:playerId,
              name:r['PLAYER_NAME'],
              cash:r['PLAYER_CASH'],
              userId: r['PLAYER_USER_ID']
            };
          }
        });

        Object.values(boardListings).forEach((b:BoardListing)=>{
          b.owner = boardOwner[b.boardId];
          b.players = Object.values(boardPlayers[b.boardId])
        });

        return <BoardListings>{
          offset:0,
          total:total,
          limit:total,
          boardListings: Object.values(boardListings)
        }
      });
  }


  updateBoard(board: Board):Q.Promise<Board> {
        // update board & current player
    return Q.ninvoke(pool, "query",
          'UPDATE BOARD SET NAME=?, DESCRIPTION=?, OWNER_ID=?, CURRENT_PLAYER_ID=? WHERE ID=?',
          [board.name, board.description, board.ownerId, board.currentPlayer._id])
      .spread((ok:OkPacket, fields:FieldInfo[])=>{
        if (ok.affectedRows < 1) { throw Error('board not updated'); }
        // update item's owner
        let p:Q.Promise<[OkPacket,FieldInfo[]]>[] = [];
        Q.ninvoke(pool, 'query', `UPDATE ITEM SET OWNING_PLAYER_ID=? WHERE BOARD_ID=?`, [board._id])
          .spread((ok:OkPacket, fieldInfo:FieldInfo[])=>{
            (<any>Object).values(board.items).forEach((i:Item)=>{
                p.push(
                 Q.ninvoke<[OkPacket,FieldInfo[]]>(pool, "query",
                  'UPDATE ITEM SET OWNING_PLAYER_ID=? WHERE  BOARD_ID=? AND ID=?',
                  [(i.owner ? i.owner._id : null), board._id, i._id])
                );
              });
          });
        return Q.all(p);
      }).then((results:[OkPacket, FieldInfo[]][])=>{
        results.forEach((r:[OkPacket, FieldInfo[]])=>{
          if (r[0].affectedRows < 1) { throw Error('item owner not updated'); }
        });
        // update players on item
        let r2:Q.Promise<[OkPacket,FieldInfo[]]>[] =[];
        Q.ninvoke(pool, 'query', `UPDATE PLAYER SET LANDING_ON_ITEM_ID=null WHERE BOARD_ID-?`, [board._id])
          .spread((ok:OkPacket, fieldInfo:FieldInfo[])=>{
            (<any>Object).values(board.items).forEach((i: Item) => {
              i.playersOnItem.forEach((p:PlayerShallowCopy)=>{
                r2.push(
                  Q.ninvoke<[OkPacket, FieldInfo[]]>(pool, "query",
                    'UPDATE PLAYER SET LANDING_ON_ITEM_ID=? WHERE BOARD_ID=? AND ID=?',
                    [i._id, board._id, p._id])
                );
              })
            });
          });
        return Q.all(r2);
      }).then((results:[OkPacket, FieldInfo[]][])=>{
        results.forEach((r:[OkPacket, FieldInfo[]])=>{
          if (r[0].affectedRows < 1) { throw Error('item players not updated'); }
        });
        // update players in jail
        let r1:Q.Promise<[OkPacket,FieldInfo[]]>[] =[];
        Q.ninvoke(pool, 'query', `UPDATE PLAYER SET IN_JAIL=0 WHERE BOARD_ID=?`,[board._id])
          .spread((ok:OkPacket,fieldInfo:FieldInfo[])=>{
            (<any>Object).values(board.items).forEach((i: Item) => {
              i.playersInJail && i.playersInJail.forEach((p:PlayerShallowCopy)=>{
                r1.push(
                  Q.ninvoke<[OkPacket, FieldInfo[]]>(pool, "query",
                    'UPDATE PLAYER SET IN_JAIL=? WHERE BOARD_ID=? AND ID=?',
                    [i._id, board._id, p._id])
                );
              })
            });
          });
        return Q.all(r1);

      }).then((results:[OkPacket, FieldInfo[]][])=>{
        results.forEach((r:[OkPacket, FieldInfo[]])=>{
          if (r[0].affectedRows < 1) { throw Error('players in jail not updated'); }
        });

        // update players on board
        return Q.invoke(pool, 'query', `UPDATE PLAYER SET BOARD_ID = null WHERE BOARD_ID=?`, [board._id])
          .spread((ok:OkPacket, fieldInfo:FieldInfo[])=>{
            let x:Q.Promise<[OkPacket, FieldInfo[]]>[] =
            board.players.map((p:PlayerShallowCopy)=>{
              return Q.ninvoke(pool, "query", `UPDATE PLAYER SET BOARD_ID = ? WHERE ID=?`, [board._id, p._id])
            });
            return Q.all(x);
          });

      }).then((results:[OkPacket, FieldInfo[]][])=>{
        return this.getBoard(board._id);
      });
  }


  joinBoard(userId:number, boardId:number):Q.Promise<Board> {
        // if already joined, don't allow joining again
    return Q.ninvoke<[RowDataPacket[], FieldInfo[]][]>(pool, "query",
          `SELECT COUNT(*) AS COUNT FROM PLAYER WHERE USER_ID=? AND BOARD_ID=?`,
          [userId, boardId])
          .spread((rowData:RowDataPacket[], fieldInfo:FieldInfo[][])=>{
            //.then((results:[RowDataPacket[],FieldInfo[]][])=>{
            if (rowData[0]['COUNT']>0) {
              throw Error(`User ${userId} already on board ${boardId}`);
            }
            return null;
          }).then((r:any)=>{
            return Q.ninvoke<[OkPacket, FieldInfo[]]>(pool, "query",
              `INSERT INTO PLAYER (USER_ID, BOARD_ID, CASH, LANDING_ON_ITEM_ID, IN_JAIL) VALUES (?, ?, ?, ?, ?)`,
              [userId, boardId, 0, ID_GO, 0]);
          })
          .then((result:[OkPacket, FieldInfo[]])=>{
            if (result[0].affectedRows < 0) {
              throw Error('player not updated');
            }
            return this.getBoard(boardId);
          });
  }

  getAvatar(userId:number):Q.Promise<Avatar> {
    return Q.ninvoke<RowDataPacket[]>(pool, 'query',
          `SELECT MIME_TYPE, SIZE, AVATAR FROM AVATAR WHERE USER_ID=?`, [userId])
      .spread((rowData:RowDataPacket[], fieldInfo:FieldInfo[])=>{
        if (rowData && rowData.length >= 1) {
          let mimeType:string = rowData[0]['MIME_TYPE'];
          let size:number = rowData[0]['SIZE'];
          let avatar:Buffer = rowData[0]['AVATAR'];

          return <Avatar>{
            mimeType: mimeType,
            size:size,
            avatar:avatar
          };
        } else {
          return Q.nfcall<Buffer>(fs.readFile, path.join(__dirname, "..", "assets", "avatar", "no-avatar.png"))
            .then((data:Buffer)=>{
              return <Avatar>{
                mimeType: "image/png",
                size: data.byteLength,
                avatar: data
              };
            });
        }
      });
  }


  isArray(i:any):i is [] {
   return i['length'];
  }
}

