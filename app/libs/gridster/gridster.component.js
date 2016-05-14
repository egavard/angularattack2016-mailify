"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var gridster_preview_component_1 = require('./gridster-preview.component');
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var gridster_1 = require('./gridster');
var log_decorator_1 = require('../../decorators/log.decorator');
/**
 * Created by egavard on 14/05/16.
 */
var Gridster = (function () {
    function Gridster() {
        var _this = this;
        this._gridster = this;
        this._columns = 6;
        this._pushing = true;
        this._floating = true;
        this._swapping = true;
        this._width = 'auto';
        this._colWidth = 'auto';
        this._rowHeight = 'match';
        this._margins = [10, 10];
        this._outerMargin = true;
        this._isMobile = false;
        this._mobileBreakPoint = 600;
        this._mobileModeEnabled = true;
        this._minRows = 1;
        this._maxRows = 100;
        this._defaultSizeX = 2;
        this._defaultSizeY = 1;
        this._minSizeX = 1;
        this._maxSizeX = null;
        this._minSizeY = 1;
        this._maxSizeY = null;
        this._saveGridItemCalculatedHeightInMobile = false;
        this._resizable = new gridster_1.GridsterResizable();
        this._draggable = new gridster_1.GridsterDraggable();
        this._flag = false;
        this._loaded = false;
        this._grid = [];
        this._items = [];
        this._floatingEvent = new core_1.EventEmitter();
        this._gridHeightEvent = new core_1.EventEmitter();
        this._movingItemEvent = new core_1.EventEmitter();
        setTimeout(function () {
            _this._floatingEvent.subscribe(function (event) {
                _this.floatItemsUp();
            });
            _this.loaded = true;
        }, 100);
        this._gridHeightEvent.subscribe(function (event) {
            _this.updateHeight();
        });
        this._movingItemEvent.subscribe(function (event) {
            _this.updateHeight();
        });
    }
    Gridster.prototype.layoutChanged = function () {
        var _this = this;
        if (this._flag) {
            return;
        }
        this._flag = true;
        setTimeout(function () {
            _this._flag = false;
            if (_this._loaded) {
                _this.floatItemsUp();
            }
            _this.updateHeight(_this._movingItem ? _this._movingItem.sizeY : 0);
        }, 30);
    };
    Gridster.prototype.destroy = function () {
        this._grid = [];
    };
    Gridster.prototype.canItemOccupy = function (item, row, column) {
        return row > -1 && column > -1 && item.sizeX + column <= this._columns && item.sizeY + row <= this._maxRows;
    };
    Gridster.prototype.autoSetItemPosition = function (item) {
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
    };
    Gridster.prototype.getItems = function (row, column, sizeX, sizeY, excludeItems) {
        var items = [];
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
    };
    Gridster.prototype.getBoundingBox = function (items) {
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
    ;
    /**
     * Removes an item from the grid
     *
     * @param {Object} item
     */
    Gridster.prototype.removeItem = function (item) {
        for (var rowIndex = 0, l = this._grid.length; rowIndex < l; ++rowIndex) {
            var columns = this._grid[rowIndex];
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
    ;
    /**
     * Returns the item at a specified coordinate
     *
     * @param {Number} row
     * @param {Number} column
     * @param {Array} excludeItems Items to exclude from selection
     * @returns {Object} The matched item or null
     */
    Gridster.prototype.getItem = function (row, column, excludeItems) {
        var sizeY = 1;
        while (row > -1) {
            var sizeX = 1, col = column;
            while (col > -1) {
                var items = this._grid[row];
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
    };
    Gridster.prototype.putItems = function (items) {
        for (var i = 0, l = items.length; i < l; ++i) {
            this.putItem(items[i]);
        }
    };
    ;
    /**
     * Insert a single item into the grid
     *
     * @param {Object} item The item to insert
     * @param {Number} row (Optional) Specifies the grid row index
     * @param {Number} column (Optional) Specifies the grid column index
     * @param {Array} ignoreItems
     */
    Gridster.prototype.putItem = function (item, row, column, ignoreItems) {
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
            var inGrid = this._grid[row] && this._grid[row][column] === item;
            if (samePosition && inGrid) {
                item.row = row;
                item.col = column;
                return;
            }
            else {
                // remove from old position
                var oldRow = this._grid[item.oldRow];
                if (oldRow && oldRow[item.oldColumn] === item) {
                    delete oldRow[item.oldColumn];
                }
            }
        }
        item.oldRow = item.row = row;
        item.oldColumn = item.col = column;
        this.moveOverlappingItems(item, ignoreItems);
        if (!this._grid[row]) {
            this._grid[row] = [];
        }
        this._grid[row][column] = item;
        this._items.push(item);
        if (this._movingItem === item) {
            this.floatItemUp(item);
        }
        this.layoutChanged();
    };
    ;
    /**
     * Trade row and column if item1 with item2
     *
     * @param {Object} item1
     * @param {Object} item2
     */
    Gridster.prototype.swapItems = function (item1, item2) {
        this._grid[item1.row][item1.col] = item2;
        this._grid[item2.row][item2.col] = item1;
        var item1Row = item1.row;
        var item1Col = item1.col;
        item1.row = item2.row;
        item1.col = item2.col;
        item2.row = item1Row;
        item2.col = item1Col;
    };
    ;
    /**
     * Prevents grid from being overlapped
     *
     * @param {Object} item The item that should remain
     * @param {Array} ignoreItems
     */
    Gridster.prototype.moveOverlappingItems = function (item, ignoreItems) {
        // don't move item, so ignore it
        if (!ignoreItems) {
            ignoreItems = [item];
        }
        else if (ignoreItems.indexOf(item) === -1) {
            ignoreItems = ignoreItems.slice(0);
            ignoreItems.push(item);
        }
        // get the grid in the space occupied by the item's coordinates
        var overlappingItems = this.getItems(item.row, item.col, item.sizeX, item.sizeY, ignoreItems);
        this.moveItemsDown(overlappingItems, item.row + item.sizeY, ignoreItems);
    };
    ;
    /**
     * Moves an array of grid to a specified row
     *
     * @param {Array} items The grid to move
     * @param {Number} newRow The target row
     * @param {Array} ignoreItems
     */
    Gridster.prototype.moveItemsDown = function (items, newRow, ignoreItems) {
        if (!items || items.length === 0) {
            return;
        }
        items.sort(function (a, b) {
            return a.row - b.row;
        });
        ignoreItems = ignoreItems ? ignoreItems.slice(0) : [];
        var topRows = {}, item, i, l;
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
    ;
    /**
     * Moves an item down to a specified row
     *
     * @param {Object} item The item to move
     * @param {Number} newRow The target row
     * @param {Array} ignoreItems
     */
    Gridster.prototype.moveItemDown = function (item, newRow, ignoreItems) {
        if (item.row >= newRow) {
            return;
        }
        while (item.row < newRow) {
            ++item.row;
            this.moveOverlappingItems(item, ignoreItems);
        }
        this.putItem(item, item.row, item.col, ignoreItems);
    };
    ;
    /**
     * Moves all grid up as much as possible
     */
    Gridster.prototype.floatItemsUp = function () {
        if (this._floating === false) {
            return;
        }
        for (var rowIndex = 0, l = this._grid.length; rowIndex < l; ++rowIndex) {
            var columns = this._grid[rowIndex];
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
    ;
    /**
     * Float an item up to the most suitable row
     *
     * @param {Object} item The item to move
     */
    Gridster.prototype.floatItemUp = function (item) {
        if (this._floating === false) {
            return;
        }
        var colIndex = item.col, sizeY = item.sizeY, sizeX = item.sizeX, bestRow = null, bestColumn = null, rowIndex = item.row - 1;
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
    ;
    /**
     * Update gridsters height
     *
     * @param {Number} plus (Optional) Additional height to add
     */
    Gridster.prototype.updateHeight = function (plus) {
        var maxHeight = this._minRows;
        plus = plus || 0;
        for (var rowIndex = this._grid.length; rowIndex >= 0; --rowIndex) {
            var columns = this._grid[rowIndex];
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
    ;
    /**
     * Returns the number of rows that will fit in given amount of pixels
     *
     * @param {Number} pixels
     * @param {Boolean} ceilOrFloor (Optional) Determines rounding method
     */
    Gridster.prototype.pixelsToRows = function (pixels, ceilOrFloor) {
        if (!this._outerMargin) {
            pixels += this._margins[0] / 2;
        }
        if (ceilOrFloor === true) {
            return Math.ceil(pixels / this._curRowHeight);
        }
        else if (ceilOrFloor === false) {
            return Math.floor(pixels / this._curRowHeight);
        }
        return Math.round(pixels / this._curRowHeight);
    };
    ;
    /**
     * Returns the number of columns that will fit in a given amount of pixels
     *
     * @param {Number} pixels
     * @param {Boolean} ceilOrFloor (Optional) Determines rounding method
     * @returns {Number} The number of columns
     */
    Gridster.prototype.pixelsToColumns = function (pixels, ceilOrFloor) {
        if (!this._outerMargin) {
            pixels += this._margins[1] / 2;
        }
        if (ceilOrFloor === true) {
            return Math.ceil(pixels / this._curColWidth);
        }
        else if (ceilOrFloor === false) {
            return Math.floor(pixels / this._curColWidth);
        }
        return Math.round(pixels / this._curColWidth);
    };
    Gridster.prototype.updateHeight = function () {
        this._displayedHeight = (this.gridHeight * this.curRowHeight) + (this.outerMargin ? this.margins[0] : -this.margins[0]);
    };
    Object.defineProperty(Gridster.prototype, "gridster", {
        get: function () {
            return this._gridster;
        },
        set: function (value) {
            this._gridster = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Gridster.prototype, "columns", {
        get: function () {
            return this._columns;
        },
        set: function (value) {
            this._columns = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Gridster.prototype, "pushing", {
        get: function () {
            return this._pushing;
        },
        set: function (value) {
            this._pushing = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Gridster.prototype, "floating", {
        get: function () {
            return this._floating;
        },
        set: function (value) {
            this._floating = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Gridster.prototype, "swapping", {
        get: function () {
            return this._swapping;
        },
        set: function (value) {
            this._swapping = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Gridster.prototype, "width", {
        get: function () {
            return this._width;
        },
        set: function (value) {
            this._width = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Gridster.prototype, "colWidth", {
        get: function () {
            return this._colWidth;
        },
        set: function (value) {
            this._colWidth = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Gridster.prototype, "rowHeight", {
        get: function () {
            return this._rowHeight;
        },
        set: function (value) {
            this._rowHeight = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Gridster.prototype, "margins", {
        get: function () {
            return this._margins;
        },
        set: function (value) {
            this._margins = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Gridster.prototype, "outerMargin", {
        get: function () {
            return this._outerMargin;
        },
        set: function (value) {
            this._outerMargin = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Gridster.prototype, "isMobile", {
        get: function () {
            return this._isMobile;
        },
        set: function (value) {
            this._isMobile = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Gridster.prototype, "mobileBreakPoint", {
        get: function () {
            return this._mobileBreakPoint;
        },
        set: function (value) {
            this._mobileBreakPoint = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Gridster.prototype, "mobileModeEnabled", {
        get: function () {
            return this._mobileModeEnabled;
        },
        set: function (value) {
            this._mobileModeEnabled = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Gridster.prototype, "minRows", {
        get: function () {
            return this._minRows;
        },
        set: function (value) {
            this._minRows = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Gridster.prototype, "maxRows", {
        get: function () {
            return this._maxRows;
        },
        set: function (value) {
            this._maxRows = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Gridster.prototype, "defaultSizeX", {
        get: function () {
            return this._defaultSizeX;
        },
        set: function (value) {
            this._defaultSizeX = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Gridster.prototype, "defaultSizeY", {
        get: function () {
            return this._defaultSizeY;
        },
        set: function (value) {
            this._defaultSizeY = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Gridster.prototype, "minSizeX", {
        get: function () {
            return this._minSizeX;
        },
        set: function (value) {
            this._minSizeX = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Gridster.prototype, "maxSizeX", {
        get: function () {
            return this._maxSizeX;
        },
        set: function (value) {
            this._maxSizeX = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Gridster.prototype, "minSizeY", {
        get: function () {
            return this._minSizeY;
        },
        set: function (value) {
            this._minSizeY = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Gridster.prototype, "maxSizeY", {
        get: function () {
            return this._maxSizeY;
        },
        set: function (value) {
            this._maxSizeY = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Gridster.prototype, "gridHeight", {
        get: function () {
            return this._gridHeight;
        },
        set: function (value) {
            this._gridHeight = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Gridster.prototype, "curRowHeight", {
        get: function () {
            return this._curRowHeight;
        },
        set: function (value) {
            this._curRowHeight = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Gridster.prototype, "curColWidth", {
        get: function () {
            return this._curColWidth;
        },
        set: function (value) {
            this._curColWidth = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Gridster.prototype, "saveGridItemCalculatedHeightInMobile", {
        get: function () {
            return this._saveGridItemCalculatedHeightInMobile;
        },
        set: function (value) {
            this._saveGridItemCalculatedHeightInMobile = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Gridster.prototype, "resizable", {
        get: function () {
            return this._resizable;
        },
        set: function (value) {
            this._resizable = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Gridster.prototype, "draggable", {
        get: function () {
            return this._draggable;
        },
        set: function (value) {
            this._draggable = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Gridster.prototype, "flag", {
        get: function () {
            return this._flag;
        },
        set: function (value) {
            this._flag = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Gridster.prototype, "loaded", {
        get: function () {
            return this._loaded;
        },
        set: function (value) {
            this._loaded = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Gridster.prototype, "movingItem", {
        get: function () {
            return this._movingItem;
        },
        set: function (value) {
            this._movingItem = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Gridster.prototype, "grid", {
        get: function () {
            return this._grid;
        },
        set: function (value) {
            this._grid = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Gridster.prototype, "items", {
        get: function () {
            return this._items;
        },
        set: function (value) {
            this._items = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Gridster.prototype, "floatingEvent", {
        get: function () {
            return this._floatingEvent;
        },
        set: function (value) {
            this._floatingEvent = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Gridster.prototype, "gridHeightEvent", {
        get: function () {
            return this._gridHeightEvent;
        },
        set: function (value) {
            this._gridHeightEvent = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Gridster.prototype, "movingItemEvent", {
        get: function () {
            return this._movingItemEvent;
        },
        set: function (value) {
            this._movingItemEvent = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Gridster.prototype, "displayedHeight", {
        get: function () {
            return this._displayedHeight;
        },
        set: function (value) {
            this._displayedHeight = value;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        log_decorator_1.log(), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object, Object, Object]), 
        __metadata('design:returntype', Boolean)
    ], Gridster.prototype, "canItemOccupy", null);
    __decorate([
        log_decorator_1.log(), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [gridster_1.GridsterItem]), 
        __metadata('design:returntype', void 0)
    ], Gridster.prototype, "autoSetItemPosition", null);
    __decorate([
        log_decorator_1.log(), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [gridster_1.GridsterItem, Number, Number, Array]), 
        __metadata('design:returntype', void 0)
    ], Gridster.prototype, "putItem", null);
    Gridster = __decorate([
        core_1.Component({
            selector: 'gridster',
            moduleId: module.id,
            templateUrl: './gridster.html',
            directives: [common_1.COMMON_DIRECTIVES, gridster_preview_component_1.GridsterPreview]
        }), 
        __metadata('design:paramtypes', [])
    ], Gridster);
    return Gridster;
}());
exports.Gridster = Gridster;
//# sourceMappingURL=gridster.component.js.map