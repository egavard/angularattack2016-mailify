import {Component} from '@angular/core';
import {GridsterItem} from '../libs/gridster/gridster';

@Component({
    selector: 'debug-module',
    templateUrl: './app/modules/debug-module.html'
})
export class DebugModule extends GridsterItem {

    constructor(sizeX:number = 1, sizeY:number = 1, row:number = 1, col:number = 1){
        super();
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.row = row;
        this.col = col;
    }

    edit() {
        console.log("bak");
    }
}