
import {logMysqlError, pool} from "./mysqldb";
import {PoolConnection} from "mysql";
import Q from "q";

export class MysqldbScript1 {

  run() {
    let conn:PoolConnection|undefined = undefined;
    Q.ninvoke<PoolConnection>(pool, "getConnection")
      .then((connection:PoolConnection)=>{
        conn = connection;
      }).then(()=> {
        // AVATAR
        Q.ninvoke(conn, "query",
          `CREATE TABLE IF NOT EXISTS AVATAR (
          ID INT NOT NULL AUTO_INCREMENT,
          USER_ID INT NOT NULL,
          MIME_TYPE VARCHAR(50) NOT NULL,
          SIZE INT NOT NULL,
          AVATAR LONGBLOB NOT NULL,
          PRIMARY KEY(ID)   
        )`, []);
      }).then(()=>{
        // USER
        Q.ninvoke(conn, 'query',
        `CREATE TABLE IF NOT EXISTS USER (
            ID INT NOT NULL AUTO_INCREMENT,
            NAME VARCHAR(100) NOT NULL,
            EMAIL VARCHAR(100) NOT NULL,
            PASSWORD VARCHAR(1000) NOT NULL, 
            PRIMARY KEY (ID)
          )`, []);
      }).then(()=>{
        // PLAYER
        Q.ninvoke(conn, 'query',
        `CREATE TABLE IF NOT EXISTS PLAYER (
            ID INT NOT NULL AUTO_INCREMENT,
            USER_ID INT NOT NULL,
            BOARD_ID INT NOT NULL,
            CASH NUMERIC NOT NULL,
            LANDING_ON_ITEM_ID VARCHAR(100) NOT NULL,
            IN_JAIL TINYINT NOT NULL,
            PRIMARY KEY (ID)
        )`, []);
      }).then(()=>{
        // ITEM
        Q.ninvoke(conn, 'query',
        `CREATE TABLE IF NOT EXISTS ITEM (
            ID VARCHAR(100) NOT NULL,
            BOARD_ID INT NOT NULL,
            TYPE VARCHAR(255) NOT NULL, 
            NAME VARCHAR(200) NOT NULL,
            OWNING_PLAYER_ID INT,
            NEXT_ITEM_ID VARCHAR(100) NOT NULL,
            ORDERING INT NOT NULL,
            
            COLOR VARCHAR(100),
            RENT NUMERIC,
            RENT_WITH_COLOR_SET NUMERIC,
            RENT_WITH_1_HOUSE NUMERIC, 
            RENT_WITH_2_HOUSE NUMERIC, 
            RENT_WITH_3_HOUSE NUMERIC, 
            RENT_WITH_4_HOUSE NUMERIC, 
            RENT_WITH_HOTEL NUMERIC, 
            HOUSE_COST NUMERIC, 
            HOTEL_COST NUMERIC, 
            MORTGAGE_VALUE NUMERIC, 
            UNMORTGAGE_VALUE NUMERIC, 
            MORTGAGE TINYINT,
            COST NUMERIC,
            HOUSES NUMERIC, 
            HOTELS NUMERIC, 
            
            TAX NUMERIC,
            
            PRIMARY KEY (ID, BOARD_ID)
        )`, []);
      }).then(()=>{
        // BOARD
        Q.ninvoke(conn, 'query',
        `CREATE TABLE IF NOT EXISTS BOARD (
            ID INT NOT NULL AUTO_INCREMENT,
            NAME VARCHAR(100) NOT NULL, 
            START TINYINT NOT NULL,
            DESCRIPTION VARCHAR(1000) NOT NULL,
            CREATION_DATE TIMESTAMP NOT NULL,
            OWNER_ID INT NOT NULL,
            CURRENT_PLAYER_ID INT NOT NULL,
            PRIMARY KEY (ID) 
        )`, []);
      }).then(()=>{
        Q.ninvoke(conn, 'query', "ALTER TABLE PLAYER ADD CONSTRAINT FK_PLAYER_1 FOREIGN KEY (USER_ID) REFERENCES USER(ID)", []);
      }).then(()=>{
        Q.ninvoke(conn, 'query', "ALTER TABLE PLAYER ADD CONSTRAINT FK_PLAYER_2 FOREIGN KEY (LANDING_ON_ITEM_ID, BOARD_ID) REFERENCES ITEM(ID, BOARD_ID)", []);
      }).then(()=>{
        Q.ninvoke(conn, 'query', "ALTER TABLE PLAYER ADD CONSTRAINT FK_PLAYER_3 FOREIGN KEY (BOARD_ID) REFERENCES BOARD(ID)", []);
      }).then(()=>{
        Q.ninvoke(conn, 'query', "ALTER TABLE ITEM ADD CONSTRAINT FK_ITEM_1 FOREIGN KEY (OWNING_PLAYER_ID) REFERENCES PLAYER(ID)", []);
      }).then(()=>{
        Q.ninvoke(conn, 'query', "ALTER TABLE ITEM ADD CONSTRAINT FK_ITEM_2 FOREIGN KEY (NEXT_ITEM_ID, BOARD_ID) REFERENCES ITEM(ID, BOARD_ID)", []);
      }).then(()=>{
        Q.ninvoke(conn, 'query', "ALTER TABLE ITEM ADD CONSTRAINT FK_ITEM_3 FOREIGN KEY (BOARD_ID) REFERENCES BOARD(ID)", []);
      }).then(()=>{
        Q.ninvoke(conn, 'query', "ALTER TABLE BOARD ADD CONSTRAINT FK_BOARD_1 FOREIGN KEY (OWNER_ID) REFERENCES USER(ID)", []);
      }).then(()=>{
        Q.ninvoke(conn, 'query', "ALTER TABLE BOARD ADD CONSTRAINT FK_BOARD_2 FOREIGN KEY (CURRENT_PLAYER_ID) REFERENCES USER(ID)", []);
      }).then(()=>{
        Q.ninvoke(conn, 'query', "ALTER TABLE AVATAR ADD CONSTRAINT FK_AVATAR_1 FOREIGN KEY (USER_ID) REFERENCES USER(ID)", []);
      }).catch(logMysqlError)
      .finally(()=>conn && conn.release())
    ;
  }
}