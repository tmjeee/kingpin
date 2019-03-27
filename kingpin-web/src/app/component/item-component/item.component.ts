import {Component, Input, Inject, forwardRef, Output, EventEmitter, ViewChild, OnInit} from "@angular/core";
import {Item} from 'kingpin-common/dist/index';
import {OverlayPanel} from "primeng/primeng";



export interface ItemComponentClickedEvent {
  item:Item;
  originalEvent:Event;
}

@Component({
  selector:'item-component',
  templateUrl:'./item.component.html',
  styleUrls:['./item.component.scss']
})
export class ItemComponent implements OnInit {

  @Input() item:Item;
  @Output() click:EventEmitter<ItemComponentClickedEvent>;


  constructor() {
    this.click = new EventEmitter();
  }

  onClicked(event:Event) {
    event.preventDefault();
    event.stopPropagation();
    this.click.emit(<ItemComponentClickedEvent>{
      item: this.item,
      originalEvent: event
    });
  }

  ngOnInit(): void {
  }






}
