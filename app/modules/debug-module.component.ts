import {GridsterItem} from '../libs/gridster/gridster';

export class DebugModule extends GridsterItem{

    constructor(sizeX:number, sizeY:number, row:number, col:number){
        super();
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.row = row;
        this.col = col;
    }
}