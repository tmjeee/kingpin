
import EventEmitter from "events";


export enum State {
  P_INIT,
  P_INIT_ASK,
  P_INIT_ASK_RESPONSE_BAD,
  P_INIT_ASK_RESPONSE_OK,

  P_MOVE,
  P_MOVE_RESPONSE_OK,

  P_PURCHASE_ASK,
  P_PURCHASE_ASK_RESPONSE_BAD,
  P_PURCHASE_ASK_RESPONSE_OK,
}

export class StateMachine {

  state:State;
  eventEmitter:EventEmitter;

  constructor() {
    this.state = State.P_INIT;
    this.eventEmitter = new EventEmitter();
  }

  init() {
  }


  next() {
    switch(this.state) {
      case State.P_INIT:
        this.state = State.P_INIT_ASK;
        break;
      case State.P_INIT_ASK:
        break;
    }
  }



}

