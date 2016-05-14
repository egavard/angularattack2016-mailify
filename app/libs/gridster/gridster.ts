import {Gridster} from './gridster.component';
import {ElementRef} from '@angular/core'
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
    private handle:any;
    private start:any;
    private drag:any;


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
/**
 * Should be implemented by every single module !
 */
export class GridsterItem{
    private _gridster:Gridster = null;

    private _sizeX:number;
    private _sizeY:number;
    private _row:number;
    private _col:number;
    private _oldRow:number;
    private _oldColumn:number;
    private _minSizeX:number = 0;
    private _minSizeY:number = 0;
    private _maxSizeX:number = null;
    private _maxSizeY:number = null;
    private _cols:number;
    private _rows:number;
    private _mapStyle:Map<String,String>;

    constructor(gridster:Gridster) {
        this._gridster = gridster;
        this.mapStyle = new Map<String,String>();
        this.sizeX = this._gridster.defaultSizeX;
        this.sizeY = this._gridster.defaultSizeY;
    }


    destroy() {
        // set these to null to avoid the possibility of circular references
        this._gridster = null;
        //TODO check native element method to remove an HTML node
    };

    /**
     * Returns the grid most important attributes
     */
    toJSON() {
        return {
            row: this.row,
            col: this.col,
            sizeY: this.sizeY,
            sizeX: this.sizeX
        };
    };

    isMoving() {
        return this._gridster.movingItem === this;
    };

    /**
     * Set the grid position
     *
     * @param {Number} row
     * @param {Number} column
     */
    setPosition(row:number, column:number) {
        this._gridster.putItem(this, row, column);
        if (!this.isMoving()) {
            this.setElementPosition();
        }
    };

    /**
     * Sets a specified size property
     *
     * @param {String} key Can be either "x" or "y"
     * @param {Number} value The size amount
     * @param {Boolean} preventMove
     */
    setSize(key:string, value:number, preventMove:boolean) {
        key = key.toUpperCase();
        var camelCase = 'size' + key,
            titleCase = 'Size' + key;
        if (value == '') {
            return;
        }
        if (isNaN(value) || value === 0) {
            value = this._gridster['default' + titleCase];
        }
        var max = key === 'X' ? this._gridster.columns : this._gridster.maxRows;
        if (this['max' + titleCase]) {
            max = Math.min(this['max' + titleCase], max);
        }
        if (this._gridster['max' + titleCase]) {
            max = Math.min(this._gridster['max' + titleCase], max);
        }
        if (key === 'X' && this.cols) {
            max -= this.cols;
        } else if (key === 'Y' && this.rows) {
            max -= this.rows;
        }

        var min = 0;
        if (this['min' + titleCase]) {
            min = Math.max(this['min' + titleCase], min);
        }
        if (this._gridster['min' + titleCase]) {
            min = Math.max(this._gridster['min' + titleCase], min);
        }

        value = Math.max(Math.min(value, max), min);

        var changed = (this[camelCase] !== value || (this['old' + titleCase] && this['old' + titleCase] !== value));
        this['old' + titleCase] = this[camelCase] = value;

        if (!this.isMoving()) {
            this['setElement' + titleCase]();
        }
        if (!preventMove && changed) {
            this._gridster.moveOverlappingItems(this);
            this._gridster.layoutChanged();
        }

        return changed;
    };

    /**
     * Sets the grid sizeY property
     *
     * @param {Number} rows
     * @param {Boolean} preventMove
     */
    setSizeY(rows:number, preventMove:boolean) {
        return this.setSize('Y', rows, preventMove);
    };

    /**
     * Sets the grid sizeX property
     *
     * @param {Number} columns
     * @param {Boolean} preventMove
     */
    setSizeX(columns:number, preventMove:boolean) {
        return this.setSize('X', columns, preventMove);
    };

    /**
     * Sets an elements position on the page
     */
    setElementPosition() {
        if (this._gridster.isMobile) {
            this.mapStyle.set('marginLeft',this._gridster.margins[0] + 'px');
            this.mapStyle.set('marginRight', this._gridster.margins[0] + 'px');
            this.mapStyle.set('marginTop', this._gridster.margins[1] + 'px');
            this.mapStyle.set('marginBottom', this._gridster.margins[1] + 'px');
            this.mapStyle.set('top', '');
            this.mapStyle.set('left', '');
        } else {
            this.mapStyle.set('margin','0');
            this.mapStyle.set('top', (this.row * this._gridster.curRowHeight + (this._gridster.outerMargin ? this._gridster.margins[0] : 0)) + 'px');
            this.mapStyle.set('left', (this.col * this._gridster.curColWidth + (this._gridster.outerMargin ? this._gridster.margins[1] : 0)) + 'px');
        }
    };

    /**
     * Sets an elements height
     */
    setElementSizeY() {
        if (this._gridster.isMobile && !this._gridster.saveGridItemCalculatedHeightInMobile) {
            this.mapStyle.set('height','');
        } else {
            this.mapStyle.set('height',(this.sizeY * this._gridster.curRowHeight - this._gridster.margins[0]) + 'px');
        }
    };

    /**
     * Sets an elements width
     */
    setElementSizeX() {
        if (this._gridster.isMobile) {
            this.mapStyle.set('width','');
        } else {
            this.mapStyle.set('width',(this.sizeX * this._gridster.curColWidth - this._gridster.margins[1]) + 'px');
        }
    };

    /**
     * Gets an element's width
     */
    getElementSizeX():number {
        return (this.sizeX * this._gridster.curColWidth - this._gridster.margins[1]);
    };

    /**
     * Gets an element's height
     */
    getElementSizeY():number {
        return (this.sizeY * this._gridster.curRowHeight - this._gridster.margins[0]);
    };


    get gridster():Gridster {
        return this._gridster;
    }

    set gridster(value:Gridster) {
        this._gridster = value;
    }

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

    get minSizeX():number {
        return this._minSizeX;
    }

    set minSizeX(value:number) {
        this._minSizeX = value;
    }

    get minSizeY():number {
        return this._minSizeY;
    }

    set minSizeY(value:number) {
        this._minSizeY = value;
    }

    get maxSizeX():number {
        return this._maxSizeX;
    }

    set maxSizeX(value:number) {
        this._maxSizeX = value;
    }

    get maxSizeY():number {
        return this._maxSizeY;
    }

    set maxSizeY(value:number) {
        this._maxSizeY = value;
    }

    get mapStyle():Map<String, String> {
        return this._mapStyle;
    }

    set mapStyle(value:Map<String, String>) {
        this._mapStyle = value;
    }

    get cols():number {
        return this._cols;
    }

    set cols(value:number) {
        this._cols = value;
    }

    get rows():number {
        return this._rows;
    }

    set rows(value:number) {
        this._rows = value;
    }
}