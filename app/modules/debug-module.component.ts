import {Component} from '@angular/core';
import {GridsterItem} from '../libs/gridster/gridster';

@Component({
    selector: 'debug-module',
    templateUrl: './app/modules/debug-module.html'
})
export class DebugModule  {

    // constructor(sizeX:number, sizeY:number, row:number, col:number){
        // super();
        // this.sizeX = sizeX;
        // this.sizeY = sizeY;
        // this.row = row;
        // this.col = col;
    // }

    edit() {
        console.log("bak");
    }
}