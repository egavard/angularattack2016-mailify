import {GridsterPreview} from './gridster-preview.component';
import {Component, EventEmitter} from '@angular/core'
import {COMMON_DIRECTIVES} from '@angular/common'
import {GridsterResizable, GridsterDraggable, GridsterItem} from './gridster';
import {log} from '../../decorators/log.decorator';

/**
 * Created by egavard on 14/05/16.
 */
@Component({
    selector:'gridster',
    moduleId:module.id,
    templateUrl:'./gridster.html',
    directives:[COMMON_DIRECTIVES, GridsterPreview]
})
export class Gridster {
    private _gridster:Gridster = this;
    private _columns:number = 6;
    private _pushing:boolean = true;
    private _floating:boolean = true;
    private _swapping:boolean = true;
    private _width:string = 'auto';
    private _colWidth:string = 'auto';
    private _rowHeight:string = 'match';
    private _margins:number[] = [10, 10];
    private _outerMargin:boolean = true;
    private _isMobile:boolean = false;
    private _mobileBreakPoint:number = 600;
    private _mobileModeEnabled:boolean = true;
    private _minRows:number = 1;
    private _maxRows:number = 100;
    private _defaultSizeX:number = 2;
    private _defaultSizeY:number = 1;
    private _minSizeX:number = 1;
    private _maxSizeX:number = null;
    private _minSizeY:number = 1;
    private _maxSizeY:number = null;
    private _gridHeight:number;
    private _curRowHeight:number;
    private _curColWidth:number;
    private _saveGridItemCalculatedHeightInMobile:boolean = false;
    private _resizable:GridsterResizable = new GridsterResizable();
    private _draggable:GridsterDraggable = new GridsterDraggable();
    private _flag:boolean = false;
    private _loaded:boolean = false;
    private _movingItem:GridsterItem;
    private _items:GridsterItem[][] = [];

    private floatingEvent:EventEmitter<any>;
    private gridHeightEvent:EventEmitter<any>;
    private movingItemEvent:EventEmitter<any>;
    private displayedHeight:number;

    constructor() {
        this.floatingEvent = new EventEmitter<any>();
        this.gridHeightEvent = new EventEmitter<any>();
        this.movingItemEvent = new EventEmitter<any>();


        setTimeout(() => {
            this.floatingEvent.subscribe((event:any) => {
                this.floatItemsUp();
            });
            this.loaded = true;
        }, 100);

        this.gridHeightEvent.subscribe((event:any) => {
           this.updateHeight(); 
        });
        this.movingItemEvent.subscribe((event:any) => {
            this.updateHeight();
        })
    }

    layoutChanged():void {
        if (this._flag) {
            return;
        }
        this._flag = true;
        setTimeout(() => {
            this._flag = false;
            if (this._loaded) {
                this.floatItemsUp();
            }
            this.updateHeight(this._movingItem ? this._movingItem.sizeY : 0);
        }, 30);
    }

    destroy():void {
        this._items = [];
    }
    @log()
    canItemOccupy(item, row, column):boolean {
        return row > -1 && column > -1 && item.sizeX + column <= this._columns && item.sizeY + row <= this._maxRows;
    }

    @log()
    autoSetItemPosition(item:GridsterItem) {
        // walk through each row and column looking for a place it will fit
        for (var rowIndex = 0; rowIndex < this._maxRows; ++rowIndex) {
            for (var colIndex = 0; colIndex < this._columns; ++colIndex) {
                // only insert if position is not already taken and it can fit
                var items = this.getItems(rowIndex, colIndex, item.sizeX, item.sizeY, [item]);
                if (items.length === 0 && this.canItemOccupy(item, rowIndex, colIndex)) {
                    this.putItem(item, rowIndex, colIndex);
                    return;
                }
            }
        }
        throw new Error('Unable to place item!');
    }

    getItems(row:number, column:number, sizeX:number, sizeY:number, excludeItems?:GridsterItem[]):GridsterItem[] {
        let items:GridsterItem[] = [];
        if (!sizeX || !sizeY) {
            sizeX = sizeY = 1;
        }

        for (var h = 0; h < sizeY; ++h) {
            for (var w = 0; w < sizeX; ++w) {
                var item = this.getItem(row + h, column + w, excludeItems);
                if (item && (!excludeItems || excludeItems.indexOf(item) === -1) && items.indexOf(item) === -1) {
                    items.push(item);
                }
            }
        }
        return items;
    }

    getBoundingBox(items:GridsterItem[]) {

        if (items.length === 0) {
            return null;
        }
        if (items.length === 1) {
            return {
                row: items[0].row,
                col: items[0].col,
                sizeY: items[0].sizeY,
                sizeX: items[0].sizeX
            };
        }

        var maxRow = 0;
        var maxCol = 0;
        var minRow = 9999;
        var minCol = 9999;

        for (var i = 0, l = items.length; i < l; ++i) {
            var item = items[i];
            minRow = Math.min(item.row, minRow);
            minCol = Math.min(item.col, minCol);
            maxRow = Math.max(item.row + item.sizeY, maxRow);
            maxCol = Math.max(item.col + item.sizeX, maxCol);
        }

        return {
            row: minRow,
            col: minCol,
            sizeY: maxRow - minRow,
            sizeX: maxCol - minCol
        };
    };


    /**
     * Removes an item from the grid
     *
     * @param {Object} item
     */
    removeItem(item:GridsterItem) {
        for (var rowIndex = 0, l = this._items.length; rowIndex < l; ++rowIndex) {
            var columns = this._items[rowIndex];
            if (!columns) {
                continue;
            }
            var index = columns.indexOf(item);
            if (index !== -1) {
                columns[index] = null;
                break;
            }
        }
        this.layoutChanged();
    };

    /**
     * Returns the item at a specified coordinate
     *
     * @param {Number} row
     * @param {Number} column
     * @param {Array} excludeItems Items to exclude from selection
     * @returns {Object} The matched item or null
     */
    getItem(row:number, column:number, excludeItems?: GridsterItem[]):GridsterItem{
        var sizeY = 1;
        while (row > -1) {
            var sizeX = 1,
                col = column;
            while (col > -1) {
                var items = this._items[row];
                if (items) {
                    var item = items[col];
                    if (item && (!excludeItems || excludeItems.indexOf(item) === -1) && item.sizeX >= sizeX && item.sizeY >= sizeY) {
                        return item;
                    }
                }
                ++sizeX;
                --col;
            }
            --row;
            ++sizeY;
        }
        return null;
    }

    putItems(items:GridsterItem[]) {
        for (var i = 0, l = items.length; i < l; ++i) {
            this.putItem(items[i]);
        }
    };

    /**
     * Insert a single item into the grid
     *
     * @param {Object} item The item to insert
     * @param {Number} row (Optional) Specifies the items row index
     * @param {Number} column (Optional) Specifies the items column index
     * @param {Array} ignoreItems
     */
    @log()
    putItem(item:GridsterItem, row?:number, column?:number, ignoreItems?:GridsterItem[]) {
        // auto place item if no row specified
        if (typeof row === 'undefined' || row === null) {
            row = item.row;
            column = item.col;
            if (typeof row === 'undefined' || row === null) {
                this.autoSetItemPosition(item);
                return;
            }
        }

        // keep item within allowed bounds
        if (!this.canItemOccupy(item, row, column)) {
            column = Math.min(this._columns - item.sizeX, Math.max(0, column));
            row = Math.min(this._maxRows - item.sizeY, Math.max(0, row));
        }

        // check if item is already in grid
        if (item.oldRow !== null && typeof item.oldRow !== 'undefined') {
            var samePosition = item.oldRow === row && item.oldColumn === column;
            var inGrid = this._items[row] && this._items[row][column] === item;
            if (samePosition && inGrid) {
                item.row = row;
                item.col = column;
                return;
            } else {
                // remove from old position
                var oldRow = this._items[item.oldRow];
                if (oldRow && oldRow[item.oldColumn] === item) {
                    delete oldRow[item.oldColumn];
                }
            }
        }

        item.oldRow = item.row = row;
        item.oldColumn = item.col = column;

        this.moveOverlappingItems(item, ignoreItems);

        if (!this._items[row]) {
            this._items[row] = [];
        }
        this._items[row][column] = item;

        if (this._movingItem === item) {
            this.floatItemUp(item);
        }
        this.layoutChanged();
    };

    /**
     * Trade row and column if item1 with item2
     *
     * @param {Object} item1
     * @param {Object} item2
     */
    swapItems(item1:GridsterItem, item2:GridsterItem) {
        this._items[item1.row][item1.col] = item2;
        this._items[item2.row][item2.col] = item1;

        var item1Row = item1.row;
        var item1Col = item1.col;
        item1.row = item2.row;
        item1.col = item2.col;
        item2.row = item1Row;
        item2.col = item1Col;
    };

    /**
     * Prevents items from being overlapped
     *
     * @param {Object} item The item that should remain
     * @param {Array} ignoreItems
     */
    moveOverlappingItems(item:GridsterItem, ignoreItems?:GridsterItem[]) {
        // don't move item, so ignore it
        if (!ignoreItems) {
            ignoreItems = [item];
        } else if (ignoreItems.indexOf(item) === -1) {
            ignoreItems = ignoreItems.slice(0);
            ignoreItems.push(item);
        }

        // get the items in the space occupied by the item's coordinates
        var overlappingItems = this.getItems(
            item.row,
            item.col,
            item.sizeX,
            item.sizeY,
            ignoreItems
        );
        this.moveItemsDown(overlappingItems, item.row + item.sizeY, ignoreItems);
    };

    /**
     * Moves an array of items to a specified row
     *
     * @param {Array} items The items to move
     * @param {Number} newRow The target row
     * @param {Array} ignoreItems
     */
    moveItemsDown(items:GridsterItem[], newRow:number, ignoreItems:GridsterItem[]) {
        if (!items || items.length === 0) {
            return;
        }
        items.sort(function(a, b) {
            return a.row - b.row;
        });

        ignoreItems = ignoreItems ? ignoreItems.slice(0) : [];
        var topRows = {},
            item, i, l;

        // calculate the top rows in each column
        for (i = 0, l = items.length; i < l; ++i) {
            item = items[i];
            var topRow = topRows[item.col];
            if (typeof topRow === 'undefined' || item.row < topRow) {
                topRows[item.col] = item.row;
            }
        }

        // move each item down from the top row in its column to the row
        for (i = 0, l = items.length; i < l; ++i) {
            item = items[i];
            var rowsToMove = newRow - topRows[item.col];
            this.moveItemDown(item, item.row + rowsToMove, ignoreItems);
            ignoreItems.push(item);
        }
    };
    /**
     * Moves an item down to a specified row
     *
     * @param {Object} item The item to move
     * @param {Number} newRow The target row
     * @param {Array} ignoreItems
     */
    moveItemDown(item:GridsterItem, newRow:number, ignoreItems:GridsterItem[]) {
        if (item.row >= newRow) {
            return;
        }
        while (item.row < newRow) {
            ++item.row;
            this.moveOverlappingItems(item, ignoreItems);
        }
        this.putItem(item, item.row, item.col, ignoreItems);
    };

    /**
     * Moves all items up as much as possible
     */
    floatItemsUp() {
        if (this._floating === false) {
            return;
        }
        for (var rowIndex = 0, l = this._items.length; rowIndex < l; ++rowIndex) {
            var columns = this._items[rowIndex];
            if (!columns) {
                continue;
            }
            for (var colIndex = 0, len = columns.length; colIndex < len; ++colIndex) {
                var item = columns[colIndex];
                if (item) {
                    this.floatItemUp(item);
                }
            }
        }
    };

    /**
     * Float an item up to the most suitable row
     *
     * @param {Object} item The item to move
     */
    floatItemUp(item:GridsterItem) {
        if (this._floating === false) {
            return;
        }
        var colIndex = item.col,
            sizeY = item.sizeY,
            sizeX = item.sizeX,
            bestRow = null,
            bestColumn = null,
            rowIndex = item.row - 1;

        while (rowIndex > -1) {
            var items = this.getItems(rowIndex, colIndex, sizeX, sizeY, [item]);
            if (items.length !== 0) {
                break;
            }
            bestRow = rowIndex;
            bestColumn = colIndex;
            --rowIndex;
        }
        if (bestRow !== null) {
            this.putItem(item, bestRow, bestColumn);
        }
    };

    /**
     * Update gridsters height
     *
     * @param {Number} plus (Optional) Additional height to add
     */
    updateHeight(plus?:number) {
        var maxHeight = this._minRows;
        plus = plus || 0;
        for (var rowIndex = this._items.length; rowIndex >= 0; --rowIndex) {
            var columns = this._items[rowIndex];
            if (!columns) {
                continue;
            }
            for (var colIndex = 0, len = columns.length; colIndex < len; ++colIndex) {
                if (columns[colIndex]) {
                    maxHeight = Math.max(maxHeight, rowIndex + plus + columns[colIndex].sizeY);
                }
            }
        }
        this._gridHeight = this._maxRows - maxHeight > 0 ? Math.min(this._maxRows, maxHeight) : Math.max(this._maxRows, maxHeight);
    };

    /**
     * Returns the number of rows that will fit in given amount of pixels
     *
     * @param {Number} pixels
     * @param {Boolean} ceilOrFloor (Optional) Determines rounding method
     */
    pixelsToRows(pixels:number, ceilOrFloor?:boolean) {
        if (!this._outerMargin) {
            pixels += this._margins[0] / 2;
        }

        if (ceilOrFloor === true) {
            return Math.ceil(pixels / this._curRowHeight);
        } else if (ceilOrFloor === false) {
            return Math.floor(pixels / this._curRowHeight);
        }

        return Math.round(pixels / this._curRowHeight);
    };
    /**
     * Returns the number of columns that will fit in a given amount of pixels
     *
     * @param {Number} pixels
     * @param {Boolean} ceilOrFloor (Optional) Determines rounding method
     * @returns {Number} The number of columns
     */
    pixelsToColumns(pixels:number, ceilOrFloor?:boolean) {
        if (!this._outerMargin) {
            pixels += this._margins[1] / 2;
        }

        if (ceilOrFloor === true) {
            return Math.ceil(pixels / this._curColWidth);
        } else if (ceilOrFloor === false) {
            return Math.floor(pixels / this._curColWidth);
        }

        return Math.round(pixels / this._curColWidth);
    }

    updateHeight() {
        this.displayedHeight = (this.gridHeight * this.curRowHeight) + (this.outerMargin ? this.margins[0] : -this.margins[0]);
    }


    get gridster():Gridster {
        return this._gridster;
    }

    set gridster(value:Gridster) {
        this._gridster = value;
    }

    get columns():number {
        return this._columns;
    }

    set columns(value:number) {
        this._columns = value;
    }

    get pushing():boolean {
        return this._pushing;
    }

    set pushing(value:boolean) {
        this._pushing = value;
    }

    get floating():boolean {
        return this._floating;
    }

    set floating(value:boolean) {
        this._floating = value;
    }

    get swapping():boolean {
        return this._swapping;
    }

    set swapping(value:boolean) {
        this._swapping = value;
    }

    get width():string {
        return this._width;
    }

    set width(value:string) {
        this._width = value;
    }

    get colWidth():string {
        return this._colWidth;
    }

    set colWidth(value:string) {
        this._colWidth = value;
    }

    get rowHeight():string {
        return this._rowHeight;
    }

    set rowHeight(value:string) {
        this._rowHeight = value;
    }

    get margins():number[] {
        return this._margins;
    }

    set margins(value:Array) {
        this._margins = value;
    }

    get outerMargin():boolean {
        return this._outerMargin;
    }

    set outerMargin(value:boolean) {
        this._outerMargin = value;
    }

    get isMobile():boolean {
        return this._isMobile;
    }

    set isMobile(value:boolean) {
        this._isMobile = value;
    }

    get mobileBreakPoint():number {
        return this._mobileBreakPoint;
    }

    set mobileBreakPoint(value:number) {
        this._mobileBreakPoint = value;
    }

    get mobileModeEnabled():boolean {
        return this._mobileModeEnabled;
    }

    set mobileModeEnabled(value:boolean) {
        this._mobileModeEnabled = value;
    }

    get minRows():number {
        return this._minRows;
    }

    set minRows(value:number) {
        this._minRows = value;
    }

    get maxRows():number {
        return this._maxRows;
    }

    set maxRows(value:number) {
        this._maxRows = value;
    }

    get defaultSizeX():number {
        return this._defaultSizeX;
    }

    set defaultSizeX(value:number) {
        this._defaultSizeX = value;
    }

    get defaultSizeY():number {
        return this._defaultSizeY;
    }

    set defaultSizeY(value:number) {
        this._defaultSizeY = value;
    }

    get minSizeX():number {
        return this._minSizeX;
    }

    set minSizeX(value:number) {
        this._minSizeX = value;
    }

    get maxSizeX():number {
        return this._maxSizeX;
    }

    set maxSizeX(value:number) {
        this._maxSizeX = value;
    }

    get minSizeY():number {
        return this._minSizeY;
    }

    set minSizeY(value:number) {
        this._minSizeY = value;
    }

    get maxSizeY():number {
        return this._maxSizeY;
    }

    set maxSizeY(value:number) {
        this._maxSizeY = value;
    }

    get gridHeight():number {
        return this._gridHeight;
    }

    set gridHeight(value:number) {
        this._gridHeight = value;
    }

    get curRowHeight():number {
        return this._curRowHeight;
    }

    set curRowHeight(value:number) {
        this._curRowHeight = value;
    }

    get curColWidth():number {
        return this._curColWidth;
    }

    set curColWidth(value:number) {
        this._curColWidth = value;
    }

    get saveGridItemCalculatedHeightInMobile():boolean {
        return this._saveGridItemCalculatedHeightInMobile;
    }

    set saveGridItemCalculatedHeightInMobile(value:boolean) {
        this._saveGridItemCalculatedHeightInMobile = value;
    }

    get resizable():GridsterResizable {
        return this._resizable;
    }

    set resizable(value:GridsterResizable) {
        this._resizable = value;
    }

    get draggable():GridsterDraggable {
        return this._draggable;
    }

    set draggable(value:GridsterDraggable) {
        this._draggable = value;
    }

    get flag():boolean {
        return this._flag;
    }

    set flag(value:boolean) {
        this._flag = value;
    }

    get loaded():boolean {
        return this._loaded;
    }

    set loaded(value:boolean) {
        this._loaded = value;
    }

    get movingItem():GridsterItem {
        return this._movingItem;
    }

    set movingItem(value:GridsterItem) {
        this._movingItem = value;
    }

    get items():GridsterItem[][] {
        return this._items;
    }

    set items(value:Array) {
        this._items = value;
    }
}
