/**
 * Created by egavard on 14/05/16.
 */
export class GridsterResizable{
    private _enabled:boolean = true;
    private _handles:string[] = ['s', 'e', 'n', 'w', 'se', 'ne', 'sw', 'nw'];


    get enabled():boolean {
        return this._enabled;
    }

    set enabled(value:boolean) {
        this._enabled = value;
    }

    get handles():string[] {
        return this._handles;
    }

    set handles(value:Array) {
        this._handles = value;
    }
}
export class GridsterDraggable{
    private _enabled:boolean = true;
    private _scrollSensitivity:number = 20;
    private _scrollSpeed:number = 15;


    get enabled():boolean {
        return this._enabled;
    }

    set enabled(value:boolean) {
        this._enabled = value;
    }

    get scrollSensitivity():number {
        return this._scrollSensitivity;
    }

    set scrollSensitivity(value:number) {
        this._scrollSensitivity = value;
    }

    get scrollSpeed():number {
        return this._scrollSpeed;
    }

    set scrollSpeed(value:number) {
        this._scrollSpeed = value;
    }
}
export class GridsterItem{
    private _sizeX:number;
    private _sizeY:number;
    private _row:number;
    private _col:number;
    private _oldRow:number;
    private _oldColumn:number;

    get sizeX():number {
        return this._sizeX;
    }

    set sizeX(value:number) {
        this._sizeX = value;
    }

    get sizeY():number {
        return this._sizeY;
    }

    set sizeY(value:number) {
        this._sizeY = value;
    }

    get row():number {
        return this._row;
    }

    set row(value:number) {
        this._row = value;
    }

    get col():number {
        return this._col;
    }

    set col(value:number) {
        this._col = value;
    }

    get oldRow():number {
        return this._oldRow;
    }

    set oldRow(value:number) {
        this._oldRow = value;
    }

    get oldColumn():number {
        return this._oldColumn;
    }

    set oldColumn(value:number) {
        this._oldColumn = value;
    }
}