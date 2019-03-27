
export const COOKIE_JWT_TOKEN:string = "jwt-token";
export const HTTP_HEADER_JWT_TOKEN:string = "X-jwt-token";

export const ID_FREE_PARKING:string = "free-parking";
export const ID_STRAND:string = "strand";
export const ID_CHANCE_1:string = "chance-1";
export const ID_FLEET_STREET:string = "fleet-street";
export const ID_TRAFALGAR_SQUARE:string = "trafalgar-street";
export const ID_FENCHURCH_STREET_STATION:string = "fenchurch-street-station";
export const ID_LEICESTER_SQUARE:string = "leicester-square";
export const ID_COVENTRY_STREET:string = "coventry-street";
export const ID_WATER_WORKS:string = "water-works";
export const ID_PICCADILLY:string = "piccadilly";
export const ID_GO_TO_JAIL:string = "go-to-jail";
export const ID_VINE_STREET:string = "vine-street";
export const ID_REGENT_STREET:string = "regent-street";
export const ID_MALBOROUGH_STREET:string = "malborough-street";
export const ID_OXFORD_STREET:string = "oxford-street";
export const ID_COMMUNITY_CHESS_1:string = "community-chess-1";
export const ID_COMMUNITY_CHESS_2:string = "community-chess-2";
export const ID_BOW_STREET:string = "bow-street";
export const ID_BOND_STREET:string = "bond-street";
export const ID_MARYLEBONE_STATION:string = "marylebone-station";
export const ID_LIVERPOOL_STREET_STATION:string = "liverpool-street-station";
export const ID_NORTHUMBERLAND_AVENUE:string = "northumbnd-avenue";
export const ID_CHANCE_2:string = "chance-2";
export const ID_WHITEHALL:string = "whitehall";
export const ID_PARK_LANE:string = "park-lane";
export const ID_ELECTRIC_COMPANY:string = "electric-company";
export const ID_SUPERTAX:string = "supertax";
export const ID_PALL_MALL:string = "pall-mall";
export const ID_MAYFAIR:string = "mayfair";
export const ID_JUST_VISITING_OR_JAIL:string = "just-visiting-or-jail";
export const ID_PENTONVILLE_ROAD:string = "pentonville-road";
export const ID_EUSTON_ROAD:string = "euston-road";
export const ID_CHANCE_3:string = "chance-3";
export const ID_THE_ANGLE_ISLINGTON:string = "the-angle-islington";
export const ID_KING_CROSS_STATION:string = "king-cross-station";
export const ID_INCOME_TAX:string = "income-tax";
export const ID_WHITECHAPEL_ROAD:string = "whitechapel-road";
export const ID_COMMUNITY_CHESS_3:string = "community-chess-3";
export const ID_OLD_KENT_ROAD:string = "old-kent-road";
export const ID_GO:string = "go";

export interface Result<T> {
  status: "success" | "error" | "unauthorized",
  message: string,
  payload: T;
}
export interface Board {
  _id:number;
  start:boolean;
  ownerId:string;
  name:string;
  creationDate:Date;
  description:string;
  items:{[itemId:string]:Item};
  currentPlayer: PlayerShallowCopy;
  players:PlayerShallowCopy[];
}
export interface User {
  _id:number;
  email:string;
  name:string;
  password:string;
}
export interface PlayerShallowCopy {
  _id:number;
  userId:number;
  name:string;
  cash:number;
}
export interface Player extends PlayerShallowCopy {
  ownedItems:ItemShallowCopy[];
}
export interface ItemShallowCopy {
  _id:string;
  type:"street"|"utility"|"station"|"go"|"free-parking"|"passing-or-jail"|"community-chess"|"chance"|"tax"|"go-to-jail";
  name:string;
  nextItemId:string;
  color?:"blue"|"light-blue"|"green"|"yellow"|"red"|"orange"|"pink"|"brown";
  rent?: number;
  rentWithColorSet?: number;
  rentWith1House?: number;
  rentWith2House?: number;
  rentWith3House?: number;
  rentWith4House?: number;
  rentWithHotel?: number;
  houseCost?: number;
  hotelCost?: number;
  houses?: number;
  hotels?: number;
  mortgageValue?: number;
  unmortgageValue?: number;
  mortgage?:boolean;
  cost?:number;
  tax?:number;
}
export interface Item extends ItemShallowCopy{
  playersOnItem:PlayerShallowCopy[];
  playerPassingByItem:PlayerShallowCopy|undefined|null;
  owner?:PlayerShallowCopy|undefined;
  playersInJail?:PlayerShallowCopy[];
}

export interface Movement {
  playerId:number;
  fromItemId: string;
  toItemId: string;
}
export interface Confirmation {
  _id:string;
  message:string;
}
export interface Auction { }
export interface Mortgage { }
export interface AcceptSale { }
export interface OfferSale { }
export interface SystemBroadcast {
  message:string;
  date:Date;
}
export interface PlayerBroadcast {
  fromPlayerId:string;
  date:Date;
  message:string;
}

const ITEM_GO:Item = <Item>{
  _id: ID_GO,
  type:"go",
  name: 'Go',
  nextItemId: ID_OLD_KENT_ROAD,
  playersOnItem:[],
  playerPassingByItem: undefined,
};
const ITEM_OLD_KENT_ROAD:Item = <Item>{
  _id: ID_OLD_KENT_ROAD,
  cost: 0,
  mortgage: false,
  color:"brown",
  type:"street",
  name: 'Old Kent Road',
  nextItemId: ID_COMMUNITY_CHESS_1,
  playersOnItem:[],
  playerPassingByItem: undefined,
  owner: undefined,
  rent: 2,
  rentWithColorSet: 4,
  rentWith1House:10,
  rentWith2House:30,
  rentWith3House:90,
  rentWith4House:160,
  rentWithHotel:250,
  houseCost:50,
  hotelCost:50,
  mortgageValue:30,
  unmortgageValue:33,
  houses:0,
  hotels:0
};
export const ITEM_COMMUNITY_CHESS_1:Item = <Item>{
  _id: ID_COMMUNITY_CHESS_1,
  type:"community-chess",
  name:'Community Chess 1',
  nextItemId: ID_WHITECHAPEL_ROAD,
  playersOnItem:[],
  playerPassingByItem: undefined,
};
export const ITEM_WHITECHAPEL_ROAD:Item = <Item>{
  _id: ID_WHITECHAPEL_ROAD,
  cost: 0,
  mortgage: false,
  color:"brown",
  type:"street",
  name: 'Whitechapel Road',
  nextItemId: ID_INCOME_TAX,
  playersOnItem:[],
  playerPassingByItem:undefined,
  owner:undefined,
  rent: 4,
  rentWithColorSet: 8,
  rentWith1House:20,
  rentWith2House:60,
  rentWith3House:180,
  rentWith4House:320,
  rentWithHotel:450,
  houseCost:50,
  hotelCost:50,
  mortgageValue:30,
  unmortgageValue:33,
  houses:0,
  hotels:0
};
export const ITEM_INCOME_TAX:Item = <Item>{
  _id: ID_INCOME_TAX,
  type:"tax",
  name:'Income Tax',
  nextItemId: ID_KING_CROSS_STATION,
  playersOnItem:[],
  playerPassingByItem:undefined,
  tax:0,
};
export const ITEM_KING_CROSS_STATION:Item = <Item>{
  _id: ID_KING_CROSS_STATION,
  cost: 0,
  mortgage: false,
  type:"station",
  name:'King Cross Station',
  nextItemId: ID_THE_ANGLE_ISLINGTON,
  playersOnItem:[],
  playerPassingByItem:undefined,
  owner:undefined,
  mortgageValue:100,
  unmortgageValue:110
};
export const ITEM_THE_ANGLE_ISLINGTON:Item = <Item>{
  _id: ID_THE_ANGLE_ISLINGTON,
  cost: 0,
  mortgage: false,
  color:"light-blue",
  type:"street",
  name:'The Angle Islington',
  nextItemId: ID_CHANCE_1,
  playersOnItem:[],
  playerPassingByItem:undefined,
  owner:undefined,
  rent: 6,
  rentWithColorSet: 12,
  rentWith1House:30,
  rentWith2House:90,
  rentWith3House:270,
  rentWith4House:400,
  rentWithHotel:550,
  houseCost:50,
  hotelCost:50,
  mortgageValue:50,
  unmortgageValue:55,
  hotels:0,
  houses:0
};
export const ITEM_CHANCE_1:Item = <Item>{
  _id: ID_CHANCE_1,
  type:"chance",
  name:'Chance 1',
  nextItemId: ID_EUSTON_ROAD,
  playersOnItem:[],
  playerPassingByItem:undefined,
};
export const ITEM_EUSTON_ROAD:Item = <Item>{
  _id: ID_EUSTON_ROAD,
  cost: 0,
  mortgage: false,
  color:"light-blue",
  type:"street",
  name:'Euston Road',
  nextItemId: ID_PENTONVILLE_ROAD,
  playersOnItem:[],
  playerPassingByItem:undefined,
  owner:undefined,
  rent: 6,
  rentWithColorSet: 12,
  rentWith1House:30,
  rentWith2House:90,
  rentWith3House:270,
  rentWith4House:400,
  rentWithHotel:550,
  houseCost:50,
  hotelCost:50,
  mortgageValue:50,
  unmortgageValue:55,
  hotels:0,
  houses:0
};
export const ITEM_PENTONVILLE_ROAD:Item = <Item>{
  _id: ID_PENTONVILLE_ROAD,
  cost: 0,
  mortgage: false,
  color:"light-blue",
  type:"street",
  name:'Pentonville Road',
  nextItemId: ID_JUST_VISITING_OR_JAIL,
  playersOnItem:[],
  playerPassingByItem:undefined,
  owner:undefined,
  rent: 8,
  rentWithColorSet: 16,
  rentWith1House:40,
  rentWith2House:100,
  rentWith3House:300,
  rentWith4House:450,
  rentWithHotel:600,
  houseCost:50,
  hotelCost:50,
  mortgageValue:60,
  unmortgageValue:66,
  hotels:0,
  houses:0
};
export const ITEM_JUST_VISITING_OR_JAIL:Item = <Item>{
  _id: ID_JUST_VISITING_OR_JAIL,
  type:"passing-or-jail",
  name:'Just Visiting / Jail',
  nextItemId: ID_PALL_MALL,
  playersOnItem:[],
  playerPassingByItem:undefined,
  playersInJail:[]
};
export const ITEM_PALL_MALL:Item = <Item>{
  _id: ID_PALL_MALL,
  cost: 0,
  mortgage: false,
  color:"pink",
  type:"street",
  name:'Pall Mall',
  nextItemId: ID_ELECTRIC_COMPANY,
  playersOnItem:[],
  playerPassingByItem:undefined,
  owner:undefined,
  rent: 10,
  rentWithColorSet: 20,
  rentWith1House:50,
  rentWith2House:150,
  rentWith3House:450,
  rentWith4House:625,
  rentWithHotel:720,
  houseCost:100,
  hotelCost:100,
  mortgageValue:70,
  unmortgageValue:77,
  hotels:0,
  houses:0
};
export const ITEM_ELECTRIC_COMPANY:Item = <Item>{
  _id: ID_ELECTRIC_COMPANY,
  cost: 0,
  mortgage: false,
  type:"utility",
  name:'Electric Company',
  nextItemId: ID_WHITEHALL,
  playersOnItem:[],
  playerPassingByItem:undefined,
  owner:undefined,
  mortgageValue: 75,
  unmortgageValue:83
};
export const ITEM_WHITEHALL:Item = <Item>{
  _id: ID_WHITEHALL,
  cost: 0,
  mortgage: false,
  color:"pink",
  type:"street",
  name:'Whitehall',
  nextItemId: ID_NORTHUMBERLAND_AVENUE,
  playersOnItem:[],
  playerPassingByItem:undefined,
  owner:undefined,
  rent: 10,
  rentWithColorSet: 20,
  rentWith1House:50,
  rentWith2House:150,
  rentWith3House:450,
  rentWith4House:625,
  rentWithHotel:750,
  houseCost:100,
  hotelCost:100,
  mortgageValue:70,
  unmortgageValue:77,
  hotels:0,
  houses:0
};
export const ITEM_NORTHUMBERLAND_AVENUE:Item = <Item>{
  _id: ID_NORTHUMBERLAND_AVENUE,
  cost: 0,
  mortgage: false,
  color:"pink",
  type:"street",
  name:'Northumbnd Avenue',
  nextItemId: ID_MARYLEBONE_STATION,
  playersOnItem:[],
  playerPassingByItem:undefined,
  owner:undefined,
  rent: 12,
  rentWithColorSet: 24,
  rentWith1House:60,
  rentWith2House:180,
  rentWith3House:500,
  rentWith4House:700,
  rentWithHotel:900,
  houseCost:100,
  hotelCost:100,
  mortgageValue:80,
  unmortgageValue:88,
  hotels:0,
  houses:0
};
export const ITEM_MARYLEBONE_STATION:Item = <Item>{
  _id: ID_MARYLEBONE_STATION,
  cost: 0,
  mortgage: false,
  type:"station",
  name: 'Marylebone Station',
  nextItemId: ID_BOW_STREET,
  playersOnItem:[],
  playerPassingByItem:undefined,
  owner:undefined,
  mortgageValue: 100,
  unmortgageValue: 110
};
export const ITEM_BOW_STREET:Item = <Item>{
  _id: ID_BOW_STREET,
  cost: 0,
  mortgage: false,
  color:"orange",
  type:"street",
  name:'Bow Street',
  nextItemId: ID_COMMUNITY_CHESS_2,
  playersOnItem:[],
  playerPassingByItem:undefined,
  owner:undefined,
  rent: 14,
  rentWithColorSet: 28,
  rentWith1House:70,
  rentWith2House:200,
  rentWith3House:550,
  rentWith4House:750,
  rentWithHotel:950,
  houseCost:100,
  hotelCost:100,
  mortgageValue:90,
  unmortgageValue:99,
  hotels:0,
  houses:0
};
export const ITEM_COMMUNITY_CHESS_2:Item = <Item>{
  _id: ID_COMMUNITY_CHESS_2,
  type:"community-chess",
  name:'Community Chess 2',
  nextItemId: ID_MALBOROUGH_STREET,
  playersOnItem:[],
  playerPassingByItem:undefined,
};
export const ITEM_MALBOROUGH_STREET:Item = <Item>{
  _id: ID_MALBOROUGH_STREET,
  cost: 0,
  mortgage: false,
  color:"orange",
  type:"street",
  name:'Malborough Street',
  nextItemId: ID_VINE_STREET,
  playersOnItem:[],
  playerPassingByItem:undefined,
  owner:undefined,
  rent: 14,
  rentWithColorSet: 28,
  rentWith1House:70,
  rentWith2House:200,
  rentWith3House:550,
  rentWith4House:750,
  rentWithHotel:250,
  houseCost:100,
  hotelCost:100,
  mortgageValue:90,
  unmortgageValue:99,
  hotels:0,
  houses:0
};
export const ITEM_VINE_STREET:Item = <Item>{
  _id: ID_VINE_STREET,
  cost: 0,
  mortgage: false,
  color:"orange",
  type:"street",
  name: 'Vine Street',
  nextItemId: ID_FREE_PARKING,
  playersOnItem:[],
  playerPassingByItem:undefined,
  owner:undefined,
  rent: 16,
  rentWithColorSet: 32,
  rentWith1House:80,
  rentWith2House:220,
  rentWith3House:600,
  rentWith4House:800,
  rentWithHotel:1000,
  houseCost:100,
  hotelCost:100,
  mortgageValue:100,
  unmortgageValue:110,
  hotels:0,
  houses:0
};
export const ITEM_FREE_PARKING:Item = <Item>{
  _id: ID_FREE_PARKING,
  type:"free-parking",
  name:'Free Parking',
  nextItemId: ID_STRAND,
  playersOnItem:[],
  playerPassingByItem:undefined,
};
export const ITEM_STRAND:Item = <Item>{
  _id: ID_STRAND,
  cost: 0,
  mortgage: false,
  color:"red",
  type:"street",
  name:'Strand',
  nextItemId: ID_CHANCE_2,
  playersOnItem:[],
  playerPassingByItem:undefined,
  owner:undefined,
  rent: 18,
  rentWithColorSet: 36,
  rentWith1House:90,
  rentWith2House:250,
  rentWith3House:700,
  rentWith4House:875,
  rentWithHotel:1050,
  houseCost:150,
  hotelCost:150,
  mortgageValue:110,
  unmortgageValue:121,
  hotels:0,
  houses:0
};
export const ITEM_CHANCE_2:Item = <Item>{
  _id: ID_CHANCE_2,
  type:"chance",
  name:'Chance 2',
  nextItemId: ID_FLEET_STREET,
  playersOnItem:[],
  playerPassingByItem:undefined,
};
export const ITEM_FLEET_STREET:Item = <Item>{
  _id: ID_FLEET_STREET,
  cost: 0,
  mortgage: false,
  color:"red",
  type:"street",
  name:'Fleet Street',
  nextItemId: ID_TRAFALGAR_SQUARE,
  playersOnItem:[],
  playerPassingByItem:undefined,
  owner:undefined,
  rent: 18,
  rentWithColorSet: 36,
  rentWith1House:90,
  rentWith2House:250,
  rentWith3House:700,
  rentWith4House:875,
  rentWithHotel:1050,
  houseCost:150,
  hotelCost:150,
  mortgageValue:110,
  unmortgageValue:121,
  hotels:0,
  houses:0
};
export const ITEM_TRAFALGAR_SQUARE:Item = <Item>{
  _id: ID_TRAFALGAR_SQUARE,
  cost: 0,
  mortgage: false,
  color:"red",
  type:"street",
  name:'Trafalgar Square',
  nextItemId: ID_FENCHURCH_STREET_STATION,
  playersOnItem:[],
  playerPassingByItem:undefined,
  owner:undefined,
  rent: 20,
  rentWithColorSet: 40,
  rentWith1House:100,
  rentWith2House:300,
  rentWith3House:750,
  rentWith4House:925,
  rentWithHotel:1100,
  houseCost:150,
  hotelCost:150,
  mortgageValue:120,
  unmortgageValue:132,
  hotels:0,
  houses:0
};
export const ITEM_FENCHURCH_STREET_STATION:Item = <Item>{
  _id: ID_FENCHURCH_STREET_STATION,
  cost: 0,
  mortgage: false,
  type:"station",
  name: 'Fenchurch Street',
  nextItemId: ID_LEICESTER_SQUARE,
  playersOnItem:[],
  playerPassingByItem:undefined,
  owner:undefined,
  mortgageValue: 100,
  unmortgageValue: 110
};
export const ITEM_LEICESTER_SQUARE:Item = <Item>{
  _id: ID_LEICESTER_SQUARE,
  cost: 0,
  mortgage: false,
  color:"yellow",
  type:"street",
  name:'Leicester Square',
  nextItemId: ID_COVENTRY_STREET,
  playersOnItem:[],
  playerPassingByItem:undefined,
  owner:undefined,
  rent: 22,
  rentWithColorSet: 44,
  rentWith1House:110,
  rentWith2House:330,
  rentWith3House:800,
  rentWith4House:975,
  rentWithHotel:1150,
  houseCost:150,
  hotelCost:150,
  mortgageValue:130,
  unmortgageValue:143,
  hotels:0,
  houses:0
};
export const ITEM_COVENTRY_STREET:Item = <Item>{
  _id: ID_COVENTRY_STREET,
  cost: 0,
  mortgage: false,
  color:"yellow",
  type:"street",
  name:'Coventry Street',
  nextItemId: ID_WATER_WORKS,
  playersOnItem:[],
  playerPassingByItem:undefined,
  owner:undefined,
  rent: 22,
  rentWithColorSet: 44,
  rentWith1House:110,
  rentWith2House:330,
  rentWith3House:800,
  rentWith4House:975,
  rentWithHotel:1150,
  houseCost:150,
  hotelCost:150,
  mortgageValue:130,
  unmortgageValue:145,
  hotels:0,
  houses:0
};
export const ITEM_WATER_WORKS:Item = <Item>{
  _id: ID_WATER_WORKS,
  cost: 0,
  mortgage: false,
  type:"utility",
  name: 'Water Works',
  nextItemId: ID_PICCADILLY,
  playersOnItem:[],
  playerPassingByItem:undefined,
  owner:undefined,
  mortgageValue: 75,
  unmortgageValue: 83
};
export const ITEM_PICCADILLY:Item = <Item>{
  _id: ID_PICCADILLY,
  cost: 0,
  mortgage: false,
  color:"yellow",
  type:"street",
  name: 'Piccadilly',
  nextItemId: ID_GO_TO_JAIL,
  playersOnItem:[],
  playerPassingByItem:undefined,
  owner:undefined,
  rent: 24,
  rentWithColorSet: 48,
  rentWith1House:120,
  rentWith2House:360,
  rentWith3House:850,
  rentWith4House:1025,
  rentWithHotel:1200,
  houseCost:150,
  hotelCost:150,
  mortgageValue:140,
  unmortgageValue:154,
  hotels:0,
  houses:0
};
export const ITEM_GO_TO_JAIL:Item = <Item>{
  _id: ID_GO_TO_JAIL,
  type:"go-to-jail",
  name:'Go to Jail',
  nextItemId: ID_REGENT_STREET,
  playersOnItem:[],
  playerPassingByItem:undefined,
};
export const ITEM_REGENT_STREET:Item = <Item>{
  _id: ID_REGENT_STREET,
  cost: 0,
  mortgage: false,
  color:"green",
  type:"street",
  name: 'Regent Street',
  nextItemId: ID_OXFORD_STREET,
  playersOnItem:[],
  playerPassingByItem:undefined,
  owner:undefined,
  rent: 26,
  rentWithColorSet: 52,
  rentWith1House:130,
  rentWith2House:390,
  rentWith3House:900,
  rentWith4House:1100,
  rentWithHotel:1275,
  houseCost:200,
  hotelCost:200,
  mortgageValue:150,
  unmortgageValue:165,
  hotels:0,
  houses:0
};
export const ITEM_OXFORD_STREET:Item = <Item>{
  _id: ID_OXFORD_STREET,
  cost: 0,
  mortgage: false,
  color:"green",
  type:"street",
  name:'Oxford Street',
  playersOnItem:[],
  nextItemId: ID_COMMUNITY_CHESS_3,
  playerPassingByItem:undefined,
  owner:undefined,
  rent: 26,
  rentWithColorSet: 52,
  rentWith1House:130,
  rentWith2House:390,
  rentWith3House:900,
  rentWith4House:1100,
  rentWithHotel:1275,
  houseCost:200,
  hotelCost:200,
  mortgageValue:150,
  unmortgageValue:165,
  houses:0,
  hotels:0
};
export const ITEM_COMMUNITY_CHESS_3:Item = <Item>{
  _id: ID_COMMUNITY_CHESS_3,
  type:"community-chess",
  name:'Community Chess 3',
  nextItemId: ID_BOND_STREET,
  playersOnItem:[],
  playerPassingByItem:undefined,
};
export const ITEM_BOND_STREET:Item = <Item>{
  _id: ID_BOND_STREET,
  cost: 0,
  mortgage: false,
  color:"green",
  type:"street",
  name:'Bond Street',
  nextItemId: ID_LIVERPOOL_STREET_STATION,
  playersOnItem:[],
  playerPassingByItem:undefined,
  owner:undefined,
  rent: 28,
  rentWithColorSet: 56,
  rentWith1House: 150,
  rentWith2House:450,
  rentWith3House:1000,
  rentWith4House:1200,
  rentWithHotel:1400,
  houseCost:200,
  hotelCost:200,
  mortgageValue:160,
  unmortgageValue:176,
  houses:0,
  hotels:0
};
export const ITEM_LIVERPOOL_STREET_STATION:Item = <Item>{
  _id: ID_LIVERPOOL_STREET_STATION,
  cost: 0,
  mortgage: false,
  type:"station",
  name:'Liverpool Street Station',
  nextItemId: ID_CHANCE_3,
  playersOnItem:[],
  playerPassingByItem:undefined,
  owner:undefined,
  mortgageValue: 100,
  unmortgageValue: 110
};
export const ITEM_CHANCE_3:Item = <Item>{
  _id: ID_CHANCE_3,
  type:"chance",
  name:'Chance 3',
  playersOnItem:[],
  nextItemId: ID_PARK_LANE,
  playerPassingByItem:undefined,
};
export const ITEM_PARK_LANE:Item = <Item>{
  _id: ID_PARK_LANE,
  cost: 0,
  mortgage: false,
  color:"blue",
  type:"street",
  name:'Park Lane',
  nextItemId: ID_SUPERTAX,
  playersOnItem:[],
  playerPassingByItem:undefined,
  owner:undefined,
  rent: 35,
  rentWithColorSet: 70,
  rentWith1House:175,
  rentWith2House:500,
  rentWith3House:1100,
  rentWith4House:1300,
  rentWithHotel:1500,
  houseCost:200,
  hotelCost:200,
  mortgageValue:175,
  unmortgageValue:193,
  houses:0,
  hotels:0
};
export const ITEM_SUPERTAX:Item = <Item>{
  _id: ID_SUPERTAX,
  type:"tax",
  name:'Supertax',
  playersOnItem:[],
  nextItemId: ID_MAYFAIR,
  playerPassingByItem:undefined,
  tax:0
};
export const ITEM_MAYFAIR:Item = <Item>{
  _id: ID_MAYFAIR,
  cost: 0,
  mortgage: false,
  color:"blue",
  type:"street",
  name:'Mayfair',
  nextItemId: ID_GO,
  playersOnItem:[],
  playerPassingByItem:undefined,
  owner:undefined,
  rent: 50,
  rentWithColorSet: 100,
  rentWith1House:200,
  rentWith2House:600,
  rentWith3House:1400,
  rentWith4House:1700,
  rentWithHotel:2000,
  houseCost:200,
  hotelCost:200,
  mortgageValue:200,
  unmortgageValue:220,
  houses:0,
  hotels:0
};

let _items:{[itemId:string]:Item}={};
  _items[ID_GO]=ITEM_GO;
  _items[ID_OLD_KENT_ROAD]=ITEM_OLD_KENT_ROAD;
  _items[ID_COMMUNITY_CHESS_1]=ITEM_COMMUNITY_CHESS_1;
  _items[ID_WHITECHAPEL_ROAD]= ITEM_WHITECHAPEL_ROAD;
  _items[ID_INCOME_TAX]= ITEM_INCOME_TAX;
  _items[ID_KING_CROSS_STATION]= ITEM_KING_CROSS_STATION;
  _items[ID_THE_ANGLE_ISLINGTON]= ITEM_THE_ANGLE_ISLINGTON;
  _items[ID_CHANCE_1]= ITEM_CHANCE_1;
  _items[ID_EUSTON_ROAD]= ITEM_EUSTON_ROAD;
  _items[ID_PENTONVILLE_ROAD]= ITEM_PENTONVILLE_ROAD;
  _items[ID_JUST_VISITING_OR_JAIL]= ITEM_JUST_VISITING_OR_JAIL;
  _items[ID_PALL_MALL]= ITEM_PALL_MALL;
  _items[ID_ELECTRIC_COMPANY]= ITEM_ELECTRIC_COMPANY;
  _items[ID_WHITEHALL]= ITEM_WHITEHALL;
  _items[ID_NORTHUMBERLAND_AVENUE]= ITEM_NORTHUMBERLAND_AVENUE;
  _items[ID_MARYLEBONE_STATION]= ITEM_MARYLEBONE_STATION;
  _items[ID_BOW_STREET]= ITEM_BOW_STREET;
  _items[ID_COMMUNITY_CHESS_2]= ITEM_COMMUNITY_CHESS_2;
  _items[ID_MALBOROUGH_STREET]= ITEM_MALBOROUGH_STREET;
  _items[ID_VINE_STREET]= ITEM_VINE_STREET;
  _items[ID_FREE_PARKING]= ITEM_FREE_PARKING;
  _items[ID_STRAND]= ITEM_STRAND;
  _items[ID_CHANCE_2]= ITEM_CHANCE_2;
  _items[ID_FLEET_STREET]= ITEM_FLEET_STREET;
  _items[ID_TRAFALGAR_SQUARE]= ITEM_TRAFALGAR_SQUARE;
  _items[ID_FENCHURCH_STREET_STATION]= ITEM_FENCHURCH_STREET_STATION;
  _items[ID_LEICESTER_SQUARE]= ITEM_LEICESTER_SQUARE;
  _items[ID_COVENTRY_STREET]= ITEM_COVENTRY_STREET;
  _items[ID_WATER_WORKS]= ITEM_WATER_WORKS;
  _items[ID_PICCADILLY]= ITEM_PICCADILLY;
  _items[ID_GO_TO_JAIL]= ITEM_GO_TO_JAIL;
  _items[ID_REGENT_STREET]= ITEM_REGENT_STREET;
  _items[ID_OXFORD_STREET]= ITEM_OXFORD_STREET;
  _items[ID_COMMUNITY_CHESS_3]= ITEM_COMMUNITY_CHESS_3;
  _items[ID_BOND_STREET]= ITEM_BOND_STREET;
  _items[ID_LIVERPOOL_STREET_STATION]= ITEM_LIVERPOOL_STREET_STATION;
  _items[ID_CHANCE_3]= ITEM_CHANCE_3;
  _items[ID_PARK_LANE]= ITEM_PARK_LANE;
  _items[ID_SUPERTAX]= ITEM_SUPERTAX;
  _items[ID_MAYFAIR]= ITEM_MAYFAIR;
export const items:{[itemId:string]:Item} = _items;


export interface BoardListing {
  boardId:number;
  name:string;
  start:boolean;
  description:string;
  creationDate:Date;
  owner: User;
  players: PlayerShallowCopy[];
}

export interface BoardListings {
  total:number;
  limit:number;
  offset:number;
  boardListings:BoardListing[]
}
