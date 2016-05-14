/**
 * Created by egavard on 14/05/16.
 */
    import { Component, Directive, ElementRef, Input} from '@angular/core'
@Component({
    selector:'gridster',
    moduleId:module.id,
    templateUrl:'./gridster.html',
    directives:[GridsterPreview]
})
export class Gridster {
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

    constructor() {

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

    canItemOccupy(item, row, column):boolean {
        return row > -1 && column > -1 && item.sizeX + column <= this._columns && item.sizeY + row <= this._maxRows;
    }

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
    moveOverlappingItems(item:GridsterItem, ignoreItems:GridsterItem[]) {
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
@Component({
    selector:'gridsterPreview',
    template:`<div ng-style="previewStyle()" class="gridster-item gridster-preview-holder"></div>`
})
export class GridsterPreview {
    @Input gridster:Gridster;
    previewStyle() {
        if (!this.gridster.movingItem) {
            return {
                display: 'none'
            };
        }

        return {
            display: 'block',
            height: (this.gridster.movingItem.sizeY * this.gridster.curRowHeight - this.gridster.margins[0]) + 'px',
            width: (this.gridster.movingItem.sizeX * this.gridster.curColWidth - this.gridster.margins[1]) + 'px',
            top: (this.gridster.movingItem.row * this.gridster.curRowHeight + (this.gridster.outerMargin ? this.gridster.margins[0] : 0)) + 'px',
            left: (this.gridster.movingItem.col * this.gridster.curColWidth + (this.gridster.outerMargin ? this.gridster.margins[1] : 0)) + 'px'
        };
    }
}

    /**
     * The gridster directive
     *
     * @param {Function} $timeout
     * @param {Object} $window
     * @param {Object} $rootScope
     * @param {Function} gridsterDebounce
     */
    .directive('gridster', ['$timeout', '$window', '$rootScope', 'gridsterDebounce',
        function($timeout, $window, $rootScope, gridsterDebounce) {
            return {
                scope: true,
                restrict: 'EAC',
                controller: 'GridsterCtrl',
                controllerAs: 'gridster',
                compile: function($tplElem) {

                    $tplElem.prepend('<div ng-if="gridster.movingItem" gridster-preview></div>');

                    return function(scope, $elem, attrs, gridster) {
                        gridster.loaded = false;

                        gridster.$element = $elem;

                        scope.gridster = gridster;

                        $elem.addClass('gridster');

                        var isVisible = function(ele) {
                            return ele.style.visibility !== 'hidden' && ele.style.display !== 'none';
                        };

                        function refresh(config) {
                            gridster.setOptions(config);

                            if (!isVisible($elem[0])) {
                                return;
                            }

                            // resolve "auto" & "match" values
                            if (gridster.width === 'auto') {
                                gridster.curWidth = $elem[0].offsetWidth || parseInt($elem.css('width'), 10);
                            } else {
                                gridster.curWidth = gridster.width;
                            }

                            if (gridster.colWidth === 'auto') {
                                gridster.curColWidth = (gridster.curWidth + (gridster.outerMargin ? -gridster.margins[1] : gridster.margins[1])) / gridster.columns;
                            } else {
                                gridster.curColWidth = gridster.colWidth;
                            }

                            gridster.curRowHeight = gridster.rowHeight;
                            if (typeof gridster.rowHeight === 'string') {
                                if (gridster.rowHeight === 'match') {
                                    gridster.curRowHeight = Math.round(gridster.curColWidth);
                                } else if (gridster.rowHeight.indexOf('*') !== -1) {
                                    gridster.curRowHeight = Math.round(gridster.curColWidth * gridster.rowHeight.replace('*', '').replace(' ', ''));
                                } else if (gridster.rowHeight.indexOf('/') !== -1) {
                                    gridster.curRowHeight = Math.round(gridster.curColWidth / gridster.rowHeight.replace('/', '').replace(' ', ''));
                                }
                            }

                            gridster.isMobile = gridster.mobileModeEnabled && gridster.curWidth <= gridster.mobileBreakPoint;

                            // loop through all items and reset their CSS
                            for (var rowIndex = 0, l = gridster.grid.length; rowIndex < l; ++rowIndex) {
                                var columns = gridster.grid[rowIndex];
                                if (!columns) {
                                    continue;
                                }

                                for (var colIndex = 0, len = columns.length; colIndex < len; ++colIndex) {
                                    if (columns[colIndex]) {
                                        var item = columns[colIndex];
                                        item.setElementPosition();
                                        item.setElementSizeY();
                                        item.setElementSizeX();
                                    }
                                }
                            }

                            updateHeight();
                        }

                        var optionsKey = attrs.gridster;
                        if (optionsKey) {
                            scope.$parent.$watch(optionsKey, function(newConfig) {
                                refresh(newConfig);
                            }, true);
                        } else {
                            refresh({});
                        }

                        scope.$watch(function() {
                            return gridster.loaded;
                        }, function() {
                            if (gridster.loaded) {
                                $elem.addClass('gridster-loaded');
                            } else {
                                $elem.removeClass('gridster-loaded');
                            }
                        });

                        scope.$watch(function() {
                            return gridster.isMobile;
                        }, function() {
                            if (gridster.isMobile) {
                                $elem.addClass('gridster-mobile').removeClass('gridster-desktop');
                            } else {
                                $elem.removeClass('gridster-mobile').addClass('gridster-desktop');
                            }
                            $rootScope.$broadcast('gridster-mobile-changed', gridster);
                        });

                        scope.$watch(function() {
                            return gridster.draggable;
                        }, function() {
                            $rootScope.$broadcast('gridster-draggable-changed', gridster);
                        }, true);

                        scope.$watch(function() {
                            return gridster.resizable;
                        }, function() {
                            $rootScope.$broadcast('gridster-resizable-changed', gridster);
                        }, true);

                        function updateHeight() {
                            $elem.css('height', (gridster.gridHeight * gridster.curRowHeight) + (gridster.outerMargin ? gridster.margins[0] : -gridster.margins[0]) + 'px');
                        }

                        scope.$watch(function() {
                            return gridster.gridHeight;
                        }, updateHeight);

                        scope.$watch(function() {
                            return gridster.movingItem;
                        }, function() {
                            gridster.updateHeight(gridster.movingItem ? gridster.movingItem.sizeY : 0);
                        });

                        var prevWidth = $elem[0].offsetWidth || parseInt($elem.css('width'), 10);

                        var resize = function() {
                            var width = $elem[0].offsetWidth || parseInt($elem.css('width'), 10);

                            if (!width || width === prevWidth || gridster.movingItem) {
                                return;
                            }
                            prevWidth = width;

                            if (gridster.loaded) {
                                $elem.removeClass('gridster-loaded');
                            }

                            refresh();

                            if (gridster.loaded) {
                                $elem.addClass('gridster-loaded');
                            }

                            $rootScope.$broadcast('gridster-resized', [width, $elem[0].offsetHeight], gridster);
                        };

                        // track element width changes any way we can
                        var onResize = gridsterDebounce(function onResize() {
                            resize();
                            $timeout(function() {
                                scope.$apply();
                            });
                        }, 100);

                        scope.$watch(function() {
                            return isVisible($elem[0]);
                        }, onResize);

                        // see https://github.com/sdecima/javascript-detect-element-resize
                        if (typeof window.addResizeListener === 'function') {
                            window.addResizeListener($elem[0], onResize);
                        } else {
                            scope.$watch(function() {
                                return $elem[0].offsetWidth || parseInt($elem.css('width'), 10);
                            }, resize);
                        }
                        var $win = angular.element($window);
                        $win.on('resize', onResize);

                        // be sure to cleanup
                        scope.$on('$destroy', function() {
                            gridster.destroy();
                            $win.off('resize', onResize);
                            if (typeof window.removeResizeListener === 'function') {
                                window.removeResizeListener($elem[0], onResize);
                            }
                        });

                        // allow a little time to place items before floating up
                        $timeout(function() {
                            scope.$watch('gridster.floating', function() {
                                gridster.floatItemsUp();
                            });
                            gridster.loaded = true;
                        }, 100);
                    };
                }
            };
        }
    ])

    .controller('GridsterItemCtrl', function() {
        this.$element = null;
        this.gridster = null;
        this.row = null;
        this.col = null;
        this.sizeX = null;
        this.sizeY = null;
        this.minSizeX = 0;
        this.minSizeY = 0;
        this.maxSizeX = null;
        this.maxSizeY = null;

        this.init = function($element, gridster) {
            this.$element = $element;
            this.gridster = gridster;
            this.sizeX = gridster.defaultSizeX;
            this.sizeY = gridster.defaultSizeY;
        };

        this.destroy = function() {
            // set these to null to avoid the possibility of circular references
            this.gridster = null;
            this.$element = null;
        };

        /**
         * Returns the items most important attributes
         */
        this.toJSON = function() {
            return {
                row: this.row,
                col: this.col,
                sizeY: this.sizeY,
                sizeX: this.sizeX
            };
        };

        this.isMoving = function() {
            return this.gridster.movingItem === this;
        };

        /**
         * Set the items position
         *
         * @param {Number} row
         * @param {Number} column
         */
        this.setPosition = function(row, column) {
            this.gridster.putItem(this, row, column);

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
        this.setSize = function(key, value, preventMove) {
            key = key.toUpperCase();
            var camelCase = 'size' + key,
                titleCase = 'Size' + key;
            if (value === '') {
                return;
            }
            value = parseInt(value, 10);
            if (isNaN(value) || value === 0) {
                value = this.gridster['default' + titleCase];
            }
            var max = key === 'X' ? this.gridster.columns : this.gridster.maxRows;
            if (this['max' + titleCase]) {
                max = Math.min(this['max' + titleCase], max);
            }
            if (this.gridster['max' + titleCase]) {
                max = Math.min(this.gridster['max' + titleCase], max);
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
            if (this.gridster['min' + titleCase]) {
                min = Math.max(this.gridster['min' + titleCase], min);
            }

            value = Math.max(Math.min(value, max), min);

            var changed = (this[camelCase] !== value || (this['old' + titleCase] && this['old' + titleCase] !== value));
            this['old' + titleCase] = this[camelCase] = value;

            if (!this.isMoving()) {
                this['setElement' + titleCase]();
            }
            if (!preventMove && changed) {
                this.gridster.moveOverlappingItems(this);
                this.gridster.layoutChanged();
            }

            return changed;
        };

        /**
         * Sets the items sizeY property
         *
         * @param {Number} rows
         * @param {Boolean} preventMove
         */
        this.setSizeY = function(rows, preventMove) {
            return this.setSize('Y', rows, preventMove);
        };

        /**
         * Sets the items sizeX property
         *
         * @param {Number} columns
         * @param {Boolean} preventMove
         */
        this.setSizeX = function(columns, preventMove) {
            return this.setSize('X', columns, preventMove);
        };

        /**
         * Sets an elements position on the page
         */
        this.setElementPosition = function() {
            if (this.gridster.isMobile) {
                this.$element.css({
                    marginLeft: this.gridster.margins[0] + 'px',
                    marginRight: this.gridster.margins[0] + 'px',
                    marginTop: this.gridster.margins[1] + 'px',
                    marginBottom: this.gridster.margins[1] + 'px',
                    top: '',
                    left: ''
                });
            } else {
                this.$element.css({
                    margin: 0,
                    top: (this.row * this.gridster.curRowHeight + (this.gridster.outerMargin ? this.gridster.margins[0] : 0)) + 'px',
                    left: (this.col * this.gridster.curColWidth + (this.gridster.outerMargin ? this.gridster.margins[1] : 0)) + 'px'
                });
            }
        };

        /**
         * Sets an elements height
         */
        this.setElementSizeY = function() {
            if (this.gridster.isMobile && !this.gridster.saveGridItemCalculatedHeightInMobile) {
                this.$element.css('height', '');
            } else {
                this.$element.css('height', (this.sizeY * this.gridster.curRowHeight - this.gridster.margins[0]) + 'px');
            }
        };

        /**
         * Sets an elements width
         */
        this.setElementSizeX = function() {
            if (this.gridster.isMobile) {
                this.$element.css('width', '');
            } else {
                this.$element.css('width', (this.sizeX * this.gridster.curColWidth - this.gridster.margins[1]) + 'px');
            }
        };

        /**
         * Gets an element's width
         */
        this.getElementSizeX = function() {
            return (this.sizeX * this.gridster.curColWidth - this.gridster.margins[1]);
        };

        /**
         * Gets an element's height
         */
        this.getElementSizeY = function() {
            return (this.sizeY * this.gridster.curRowHeight - this.gridster.margins[0]);
        };

    })

    .factory('GridsterTouch', [function() {
        return function GridsterTouch(target, startEvent, moveEvent, endEvent) {
            var lastXYById = {};

            //  Opera doesn't have Object.keys so we use this wrapper
            var numberOfKeys = function(theObject) {
                if (Object.keys) {
                    return Object.keys(theObject).length;
                }

                var n = 0,
                    key;
                for (key in theObject) {
                    ++n;
                }

                return n;
            };

            //  this calculates the delta needed to convert pageX/Y to offsetX/Y because offsetX/Y don't exist in the TouchEvent object or in Firefox's MouseEvent object
            var computeDocumentToElementDelta = function(theElement) {
                var elementLeft = 0;
                var elementTop = 0;
                var oldIEUserAgent = navigator.userAgent.match(/\bMSIE\b/);

                for (var offsetElement = theElement; offsetElement != null; offsetElement = offsetElement.offsetParent) {
                    //  the following is a major hack for versions of IE less than 8 to avoid an apparent problem on the IEBlog with double-counting the offsets
                    //  this may not be a general solution to IE7's problem with offsetLeft/offsetParent
                    if (oldIEUserAgent &&
                        (!document.documentMode || document.documentMode < 8) &&
                        offsetElement.currentStyle.position === 'relative' && offsetElement.offsetParent && offsetElement.offsetParent.currentStyle.position === 'relative' && offsetElement.offsetLeft === offsetElement.offsetParent.offsetLeft) {
                        // add only the top
                        elementTop += offsetElement.offsetTop;
                    } else {
                        elementLeft += offsetElement.offsetLeft;
                        elementTop += offsetElement.offsetTop;
                    }
                }

                return {
                    x: elementLeft,
                    y: elementTop
                };
            };

            //  cache the delta from the document to our event target (reinitialized each mousedown/MSPointerDown/touchstart)
            var documentToTargetDelta = computeDocumentToElementDelta(target);

            //  common event handler for the mouse/pointer/touch models and their down/start, move, up/end, and cancel events
            var doEvent = function(theEvtObj) {

                if (theEvtObj.type === 'mousemove' && numberOfKeys(lastXYById) === 0) {
                    return;
                }

                var prevent = true;

                var pointerList = theEvtObj.changedTouches ? theEvtObj.changedTouches : [theEvtObj];
                for (var i = 0; i < pointerList.length; ++i) {
                    var pointerObj = pointerList[i];
                    var pointerId = (typeof pointerObj.identifier !== 'undefined') ? pointerObj.identifier : (typeof pointerObj.pointerId !== 'undefined') ? pointerObj.pointerId : 1;

                    //  use the pageX/Y coordinates to compute target-relative coordinates when we have them (in ie < 9, we need to do a little work to put them there)
                    if (typeof pointerObj.pageX === 'undefined') {
                        //  initialize assuming our source element is our target
                        pointerObj.pageX = pointerObj.offsetX + documentToTargetDelta.x;
                        pointerObj.pageY = pointerObj.offsetY + documentToTargetDelta.y;

                        if (pointerObj.srcElement.offsetParent === target && document.documentMode && document.documentMode === 8 && pointerObj.type === 'mousedown') {
                            //  source element is a child piece of VML, we're in IE8, and we've not called setCapture yet - add the origin of the source element
                            pointerObj.pageX += pointerObj.srcElement.offsetLeft;
                            pointerObj.pageY += pointerObj.srcElement.offsetTop;
                        } else if (pointerObj.srcElement !== target && !document.documentMode || document.documentMode < 8) {
                            //  source element isn't the target (most likely it's a child piece of VML) and we're in a version of IE before IE8 -
                            //  the offsetX/Y values are unpredictable so use the clientX/Y values and adjust by the scroll offsets of its parents
                            //  to get the document-relative coordinates (the same as pageX/Y)
                            var sx = -2,
                                sy = -2; // adjust for old IE's 2-pixel border
                            for (var scrollElement = pointerObj.srcElement; scrollElement !== null; scrollElement = scrollElement.parentNode) {
                                sx += scrollElement.scrollLeft ? scrollElement.scrollLeft : 0;
                                sy += scrollElement.scrollTop ? scrollElement.scrollTop : 0;
                            }

                            pointerObj.pageX = pointerObj.clientX + sx;
                            pointerObj.pageY = pointerObj.clientY + sy;
                        }
                    }


                    var pageX = pointerObj.pageX;
                    var pageY = pointerObj.pageY;

                    if (theEvtObj.type.match(/(start|down)$/i)) {
                        //  clause for processing MSPointerDown, touchstart, and mousedown

                        //  refresh the document-to-target delta on start in case the target has moved relative to document
                        documentToTargetDelta = computeDocumentToElementDelta(target);

                        //  protect against failing to get an up or end on this pointerId
                        if (lastXYById[pointerId]) {
                            if (endEvent) {
                                endEvent({
                                    target: theEvtObj.target,
                                    which: theEvtObj.which,
                                    pointerId: pointerId,
                                    pageX: pageX,
                                    pageY: pageY
                                });
                            }

                            delete lastXYById[pointerId];
                        }

                        if (startEvent) {
                            if (prevent) {
                                prevent = startEvent({
                                    target: theEvtObj.target,
                                    which: theEvtObj.which,
                                    pointerId: pointerId,
                                    pageX: pageX,
                                    pageY: pageY
                                });
                            }
                        }

                        //  init last page positions for this pointer
                        lastXYById[pointerId] = {
                            x: pageX,
                            y: pageY
                        };

                        // IE pointer model
                        if (target.msSetPointerCapture) {
                            target.msSetPointerCapture(pointerId);
                        } else if (theEvtObj.type === 'mousedown' && numberOfKeys(lastXYById) === 1) {
                            if (useSetReleaseCapture) {
                                target.setCapture(true);
                            } else {
                                document.addEventListener('mousemove', doEvent, false);
                                document.addEventListener('mouseup', doEvent, false);
                            }
                        }
                    } else if (theEvtObj.type.match(/move$/i)) {
                        //  clause handles mousemove, MSPointerMove, and touchmove

                        if (lastXYById[pointerId] && !(lastXYById[pointerId].x === pageX && lastXYById[pointerId].y === pageY)) {
                            //  only extend if the pointer is down and it's not the same as the last point

                            if (moveEvent && prevent) {
                                prevent = moveEvent({
                                    target: theEvtObj.target,
                                    which: theEvtObj.which,
                                    pointerId: pointerId,
                                    pageX: pageX,
                                    pageY: pageY
                                });
                            }

                            //  update last page positions for this pointer
                            lastXYById[pointerId].x = pageX;
                            lastXYById[pointerId].y = pageY;
                        }
                    } else if (lastXYById[pointerId] && theEvtObj.type.match(/(up|end|cancel)$/i)) {
                        //  clause handles up/end/cancel

                        if (endEvent && prevent) {
                            prevent = endEvent({
                                target: theEvtObj.target,
                                which: theEvtObj.which,
                                pointerId: pointerId,
                                pageX: pageX,
                                pageY: pageY
                            });
                        }

                        //  delete last page positions for this pointer
                        delete lastXYById[pointerId];

                        //  in the Microsoft pointer model, release the capture for this pointer
                        //  in the mouse model, release the capture or remove document-level event handlers if there are no down points
                        //  nothing is required for the iOS touch model because capture is implied on touchstart
                        if (target.msReleasePointerCapture) {
                            target.msReleasePointerCapture(pointerId);
                        } else if (theEvtObj.type === 'mouseup' && numberOfKeys(lastXYById) === 0) {
                            if (useSetReleaseCapture) {
                                target.releaseCapture();
                            } else {
                                document.removeEventListener('mousemove', doEvent, false);
                                document.removeEventListener('mouseup', doEvent, false);
                            }
                        }
                    }
                }

                if (prevent) {
                    if (theEvtObj.preventDefault) {
                        theEvtObj.preventDefault();
                    }

                    if (theEvtObj.preventManipulation) {
                        theEvtObj.preventManipulation();
                    }

                    if (theEvtObj.preventMouseEvent) {
                        theEvtObj.preventMouseEvent();
                    }
                }
            };

            var useSetReleaseCapture = false;
            // saving the settings for contentZooming and touchaction before activation
            var contentZooming, msTouchAction;

            this.enable = function() {

                if (window.navigator.msPointerEnabled) {
                    //  Microsoft pointer model
                    target.addEventListener('MSPointerDown', doEvent, false);
                    target.addEventListener('MSPointerMove', doEvent, false);
                    target.addEventListener('MSPointerUp', doEvent, false);
                    target.addEventListener('MSPointerCancel', doEvent, false);

                    //  css way to prevent panning in our target area
                    if (typeof target.style.msContentZooming !== 'undefined') {
                        contentZooming = target.style.msContentZooming;
                        target.style.msContentZooming = 'none';
                    }

                    //  new in Windows Consumer Preview: css way to prevent all built-in touch actions on our target
                    //  without this, you cannot touch draw on the element because IE will intercept the touch events
                    if (typeof target.style.msTouchAction !== 'undefined') {
                        msTouchAction = target.style.msTouchAction;
                        target.style.msTouchAction = 'none';
                    }
                } else if (target.addEventListener) {
                    //  iOS touch model
                    target.addEventListener('touchstart', doEvent, false);
                    target.addEventListener('touchmove', doEvent, false);
                    target.addEventListener('touchend', doEvent, false);
                    target.addEventListener('touchcancel', doEvent, false);

                    //  mouse model
                    target.addEventListener('mousedown', doEvent, false);

                    //  mouse model with capture
                    //  rejecting gecko because, unlike ie, firefox does not send events to target when the mouse is outside target
                    if (target.setCapture && !window.navigator.userAgent.match(/\bGecko\b/)) {
                        useSetReleaseCapture = true;

                        target.addEventListener('mousemove', doEvent, false);
                        target.addEventListener('mouseup', doEvent, false);
                    }
                } else if (target.attachEvent && target.setCapture) {
                    //  legacy IE mode - mouse with capture
                    useSetReleaseCapture = true;
                    target.attachEvent('onmousedown', function() {
                        doEvent(window.event);
                        window.event.returnValue = false;
                        return false;
                    });
                    target.attachEvent('onmousemove', function() {
                        doEvent(window.event);
                        window.event.returnValue = false;
                        return false;
                    });
                    target.attachEvent('onmouseup', function() {
                        doEvent(window.event);
                        window.event.returnValue = false;
                        return false;
                    });
                }
            };

            this.disable = function() {
                if (window.navigator.msPointerEnabled) {
                    //  Microsoft pointer model
                    target.removeEventListener('MSPointerDown', doEvent, false);
                    target.removeEventListener('MSPointerMove', doEvent, false);
                    target.removeEventListener('MSPointerUp', doEvent, false);
                    target.removeEventListener('MSPointerCancel', doEvent, false);

                    //  reset zooming to saved value
                    if (contentZooming) {
                        target.style.msContentZooming = contentZooming;
                    }

                    // reset touch action setting
                    if (msTouchAction) {
                        target.style.msTouchAction = msTouchAction;
                    }
                } else if (target.removeEventListener) {
                    //  iOS touch model
                    target.removeEventListener('touchstart', doEvent, false);
                    target.removeEventListener('touchmove', doEvent, false);
                    target.removeEventListener('touchend', doEvent, false);
                    target.removeEventListener('touchcancel', doEvent, false);

                    //  mouse model
                    target.removeEventListener('mousedown', doEvent, false);

                    //  mouse model with capture
                    //  rejecting gecko because, unlike ie, firefox does not send events to target when the mouse is outside target
                    if (target.setCapture && !window.navigator.userAgent.match(/\bGecko\b/)) {
                        useSetReleaseCapture = true;

                        target.removeEventListener('mousemove', doEvent, false);
                        target.removeEventListener('mouseup', doEvent, false);
                    }
                } else if (target.detachEvent && target.setCapture) {
                    //  legacy IE mode - mouse with capture
                    useSetReleaseCapture = true;
                    target.detachEvent('onmousedown');
                    target.detachEvent('onmousemove');
                    target.detachEvent('onmouseup');
                }
            };

            return this;
        };
    }])

    .factory('GridsterDraggable', ['$document', '$window', 'GridsterTouch',
        function($document, $window, GridsterTouch) {
            function GridsterDraggable($el, scope, gridster, item, itemOptions) {

                var elmX, elmY, elmW, elmH,

                    mouseX = 0,
                    mouseY = 0,
                    lastMouseX = 0,
                    lastMouseY = 0,
                    mOffX = 0,
                    mOffY = 0,

                    minTop = 0,
                    maxTop = 9999,
                    minLeft = 0,
                    realdocument = $document[0];

                var originalCol, originalRow;
                var inputTags = ['select', 'option', 'input', 'textarea', 'button'];

                function mouseDown(e) {
                    if (inputTags.indexOf(e.target.nodeName.toLowerCase()) !== -1) {
                        return false;
                    }

                    var $target = angular.element(e.target);

                    // exit, if a resize handle was hit
                    if ($target.hasClass('gridster-item-resizable-handler')) {
                        return false;
                    }

                    // exit, if the target has it's own click event
                    if ($target.attr('onclick') || $target.attr('ng-click')) {
                        return false;
                    }

                    // only works if you have jQuery
                    if ($target.closest && $target.closest('.gridster-no-drag').length) {
                        return false;
                    }

                    // apply drag handle filter
                    if (gridster.draggable && gridster.draggable.handle) {
                        var $dragHandles = angular.element($el[0].querySelectorAll(gridster.draggable.handle));
                        var match = false;
                        for (var h = 0, hl = $dragHandles.length; h < hl; ++h) {
                            var handle = $dragHandles[h];
                            if (handle === e.target) {
                                match = true;
                                break;
                            }
                        }
                        if (!match) {
                            return false;
                        }
                    }

                    switch (e.which) {
                        case 1:
                            // left mouse button
                            break;
                        case 2:
                        case 3:
                            // right or middle mouse button
                            return;
                    }

                    lastMouseX = e.pageX;
                    lastMouseY = e.pageY;

                    elmX = parseInt($el.css('left'), 10);
                    elmY = parseInt($el.css('top'), 10);
                    elmW = $el[0].offsetWidth;
                    elmH = $el[0].offsetHeight;

                    originalCol = item.col;
                    originalRow = item.row;

                    dragStart(e);

                    return true;
                }

                function mouseMove(e) {
                    if (!$el.hasClass('gridster-item-moving') || $el.hasClass('gridster-item-resizing')) {
                        return false;
                    }

                    var maxLeft = gridster.curWidth - 1;

                    // Get the current mouse position.
                    mouseX = e.pageX;
                    mouseY = e.pageY;

                    // Get the deltas
                    var diffX = mouseX - lastMouseX + mOffX;
                    var diffY = mouseY - lastMouseY + mOffY;
                    mOffX = mOffY = 0;

                    // Update last processed mouse positions.
                    lastMouseX = mouseX;
                    lastMouseY = mouseY;

                    var dX = diffX,
                        dY = diffY;
                    if (elmX + dX < minLeft) {
                        diffX = minLeft - elmX;
                        mOffX = dX - diffX;
                    } else if (elmX + elmW + dX > maxLeft) {
                        diffX = maxLeft - elmX - elmW;
                        mOffX = dX - diffX;
                    }

                    if (elmY + dY < minTop) {
                        diffY = minTop - elmY;
                        mOffY = dY - diffY;
                    } else if (elmY + elmH + dY > maxTop) {
                        diffY = maxTop - elmY - elmH;
                        mOffY = dY - diffY;
                    }
                    elmX += diffX;
                    elmY += diffY;

                    // set new position
                    $el.css({
                        'top': elmY + 'px',
                        'left': elmX + 'px'
                    });

                    drag(e);

                    return true;
                }

                function mouseUp(e) {
                    if (!$el.hasClass('gridster-item-moving') || $el.hasClass('gridster-item-resizing')) {
                        return false;
                    }

                    mOffX = mOffY = 0;

                    dragStop(e);

                    return true;
                }

                function dragStart(event) {
                    $el.addClass('gridster-item-moving');
                    gridster.movingItem = item;

                    gridster.updateHeight(item.sizeY);
                    scope.$apply(function() {
                        if (gridster.draggable && gridster.draggable.start) {
                            gridster.draggable.start(event, $el, itemOptions);
                        }
                    });
                }

                function drag(event) {
                    var oldRow = item.row,
                        oldCol = item.col,
                        hasCallback = gridster.draggable && gridster.draggable.drag,
                        scrollSensitivity = gridster.draggable.scrollSensitivity,
                        scrollSpeed = gridster.draggable.scrollSpeed;

                    var row = gridster.pixelsToRows(elmY);
                    var col = gridster.pixelsToColumns(elmX);

                    var itemsInTheWay = gridster.getItems(row, col, item.sizeX, item.sizeY, item);
                    var hasItemsInTheWay = itemsInTheWay.length !== 0;

                    if (gridster.swapping === true && hasItemsInTheWay) {
                        var boundingBoxItem = gridster.getBoundingBox(itemsInTheWay),
                            sameSize = boundingBoxItem.sizeX === item.sizeX && boundingBoxItem.sizeY === item.sizeY,
                            sameRow = boundingBoxItem.row === oldRow,
                            sameCol = boundingBoxItem.col === oldCol,
                            samePosition = boundingBoxItem.row === row && boundingBoxItem.col === col,
                            inline = sameRow || sameCol;

                        if (sameSize && itemsInTheWay.length === 1) {
                            if (samePosition) {
                                gridster.swapItems(item, itemsInTheWay[0]);
                            } else if (inline) {
                                return;
                            }
                        } else if (boundingBoxItem.sizeX <= item.sizeX && boundingBoxItem.sizeY <= item.sizeY && inline) {
                            var emptyRow = item.row <= row ? item.row : row + item.sizeY,
                                emptyCol = item.col <= col ? item.col : col + item.sizeX,
                                rowOffset = emptyRow - boundingBoxItem.row,
                                colOffset = emptyCol - boundingBoxItem.col;

                            for (var i = 0, l = itemsInTheWay.length; i < l; ++i) {
                                var itemInTheWay = itemsInTheWay[i];

                                var itemsInFreeSpace = gridster.getItems(
                                    itemInTheWay.row + rowOffset,
                                    itemInTheWay.col + colOffset,
                                    itemInTheWay.sizeX,
                                    itemInTheWay.sizeY,
                                    item
                                );

                                if (itemsInFreeSpace.length === 0) {
                                    gridster.putItem(itemInTheWay, itemInTheWay.row + rowOffset, itemInTheWay.col + colOffset);
                                }
                            }
                        }
                    }

                    if (gridster.pushing !== false || !hasItemsInTheWay) {
                        item.row = row;
                        item.col = col;
                    }

                    if (event.pageY - realdocument.body.scrollTop < scrollSensitivity) {
                        realdocument.body.scrollTop = realdocument.body.scrollTop - scrollSpeed;
                    } else if ($window.innerHeight - (event.pageY - realdocument.body.scrollTop) < scrollSensitivity) {
                        realdocument.body.scrollTop = realdocument.body.scrollTop + scrollSpeed;
                    }

                    if (event.pageX - realdocument.body.scrollLeft < scrollSensitivity) {
                        realdocument.body.scrollLeft = realdocument.body.scrollLeft - scrollSpeed;
                    } else if ($window.innerWidth - (event.pageX - realdocument.body.scrollLeft) < scrollSensitivity) {
                        realdocument.body.scrollLeft = realdocument.body.scrollLeft + scrollSpeed;
                    }

                    if (hasCallback || oldRow !== item.row || oldCol !== item.col) {
                        scope.$apply(function() {
                            if (hasCallback) {
                                gridster.draggable.drag(event, $el, itemOptions);
                            }
                        });
                    }
                }

                function dragStop(event) {
                    $el.removeClass('gridster-item-moving');
                    var row = gridster.pixelsToRows(elmY);
                    var col = gridster.pixelsToColumns(elmX);
                    if (gridster.pushing !== false || gridster.getItems(row, col, item.sizeX, item.sizeY, item).length === 0) {
                        item.row = row;
                        item.col = col;
                    }
                    gridster.movingItem = null;
                    item.setPosition(item.row, item.col);

                    scope.$apply(function() {
                        if (gridster.draggable && gridster.draggable.stop) {
                            gridster.draggable.stop(event, $el, itemOptions);
                        }
                    });
                }

                var enabled = null;
                var gridsterTouch = null;

                this.enable = function() {
                    if (enabled === true) {
                        return;
                    }
                    enabled = true;

                    if (gridsterTouch) {
                        gridsterTouch.enable();
                        return;
                    }

                    gridsterTouch = new GridsterTouch($el[0], mouseDown, mouseMove, mouseUp);
                    gridsterTouch.enable();
                };

                this.disable = function() {
                    if (enabled === false) {
                        return;
                    }

                    enabled = false;
                    if (gridsterTouch) {
                        gridsterTouch.disable();
                    }
                };

                this.toggle = function(enabled) {
                    if (enabled) {
                        this.enable();
                    } else {
                        this.disable();
                    }
                };

                this.destroy = function() {
                    this.disable();
                };
            }

            return GridsterDraggable;
        }
    ])

    .factory('GridsterResizable', ['GridsterTouch', function(GridsterTouch) {
        function GridsterResizable($el, scope, gridster, item, itemOptions) {

            function ResizeHandle(handleClass) {

                var hClass = handleClass;

                var elmX, elmY, elmW, elmH,

                    mouseX = 0,
                    mouseY = 0,
                    lastMouseX = 0,
                    lastMouseY = 0,
                    mOffX = 0,
                    mOffY = 0,

                    minTop = 0,
                    maxTop = 9999,
                    minLeft = 0;

                var getMinHeight = function() {
                    return (item.minSizeY ? item.minSizeY : 1) * gridster.curRowHeight - gridster.margins[0];
                };
                var getMinWidth = function() {
                    return (item.minSizeX ? item.minSizeX : 1) * gridster.curColWidth - gridster.margins[1];
                };

                var originalWidth, originalHeight;
                var savedDraggable;

                function mouseDown(e) {
                    switch (e.which) {
                        case 1:
                            // left mouse button
                            break;
                        case 2:
                        case 3:
                            // right or middle mouse button
                            return;
                    }

                    // save the draggable setting to restore after resize
                    savedDraggable = gridster.draggable.enabled;
                    if (savedDraggable) {
                        gridster.draggable.enabled = false;
                        scope.$broadcast('gridster-draggable-changed', gridster);
                    }

                    // Get the current mouse position.
                    lastMouseX = e.pageX;
                    lastMouseY = e.pageY;

                    // Record current widget dimensions
                    elmX = parseInt($el.css('left'), 10);
                    elmY = parseInt($el.css('top'), 10);
                    elmW = $el[0].offsetWidth;
                    elmH = $el[0].offsetHeight;

                    originalWidth = item.sizeX;
                    originalHeight = item.sizeY;

                    resizeStart(e);

                    return true;
                }

                function resizeStart(e) {
                    $el.addClass('gridster-item-moving');
                    $el.addClass('gridster-item-resizing');

                    gridster.movingItem = item;

                    item.setElementSizeX();
                    item.setElementSizeY();
                    item.setElementPosition();
                    gridster.updateHeight(1);

                    scope.$apply(function() {
                        // callback
                        if (gridster.resizable && gridster.resizable.start) {
                            gridster.resizable.start(e, $el, itemOptions); // options is the item model
                        }
                    });
                }

                function mouseMove(e) {
                    var maxLeft = gridster.curWidth - 1;

                    // Get the current mouse position.
                    mouseX = e.pageX;
                    mouseY = e.pageY;

                    // Get the deltas
                    var diffX = mouseX - lastMouseX + mOffX;
                    var diffY = mouseY - lastMouseY + mOffY;
                    mOffX = mOffY = 0;

                    // Update last processed mouse positions.
                    lastMouseX = mouseX;
                    lastMouseY = mouseY;

                    var dY = diffY,
                        dX = diffX;

                    if (hClass.indexOf('n') >= 0) {
                        if (elmH - dY < getMinHeight()) {
                            diffY = elmH - getMinHeight();
                            mOffY = dY - diffY;
                        } else if (elmY + dY < minTop) {
                            diffY = minTop - elmY;
                            mOffY = dY - diffY;
                        }
                        elmY += diffY;
                        elmH -= diffY;
                    }
                    if (hClass.indexOf('s') >= 0) {
                        if (elmH + dY < getMinHeight()) {
                            diffY = getMinHeight() - elmH;
                            mOffY = dY - diffY;
                        } else if (elmY + elmH + dY > maxTop) {
                            diffY = maxTop - elmY - elmH;
                            mOffY = dY - diffY;
                        }
                        elmH += diffY;
                    }
                    if (hClass.indexOf('w') >= 0) {
                        if (elmW - dX < getMinWidth()) {
                            diffX = elmW - getMinWidth();
                            mOffX = dX - diffX;
                        } else if (elmX + dX < minLeft) {
                            diffX = minLeft - elmX;
                            mOffX = dX - diffX;
                        }
                        elmX += diffX;
                        elmW -= diffX;
                    }
                    if (hClass.indexOf('e') >= 0) {
                        if (elmW + dX < getMinWidth()) {
                            diffX = getMinWidth() - elmW;
                            mOffX = dX - diffX;
                        } else if (elmX + elmW + dX > maxLeft) {
                            diffX = maxLeft - elmX - elmW;
                            mOffX = dX - diffX;
                        }
                        elmW += diffX;
                    }

                    // set new position
                    $el.css({
                        'top': elmY + 'px',
                        'left': elmX + 'px',
                        'width': elmW + 'px',
                        'height': elmH + 'px'
                    });

                    resize(e);

                    return true;
                }

                function mouseUp(e) {
                    // restore draggable setting to its original state
                    if (gridster.draggable.enabled !== savedDraggable) {
                        gridster.draggable.enabled = savedDraggable;
                        scope.$broadcast('gridster-draggable-changed', gridster);
                    }

                    mOffX = mOffY = 0;

                    resizeStop(e);

                    return true;
                }

                function resize(e) {
                    var oldRow = item.row,
                        oldCol = item.col,
                        oldSizeX = item.sizeX,
                        oldSizeY = item.sizeY,
                        hasCallback = gridster.resizable && gridster.resizable.resize;

                    var col = item.col;
                    // only change column if grabbing left edge
                    if (['w', 'nw', 'sw'].indexOf(handleClass) !== -1) {
                        col = gridster.pixelsToColumns(elmX, false);
                    }

                    var row = item.row;
                    // only change row if grabbing top edge
                    if (['n', 'ne', 'nw'].indexOf(handleClass) !== -1) {
                        row = gridster.pixelsToRows(elmY, false);
                    }

                    var sizeX = item.sizeX;
                    // only change row if grabbing left or right edge
                    if (['n', 's'].indexOf(handleClass) === -1) {
                        sizeX = gridster.pixelsToColumns(elmW, true);
                    }

                    var sizeY = item.sizeY;
                    // only change row if grabbing top or bottom edge
                    if (['e', 'w'].indexOf(handleClass) === -1) {
                        sizeY = gridster.pixelsToRows(elmH, true);
                    }


                    var canOccupy = row > -1 && col > -1 && sizeX + col <= gridster.columns && sizeY + row <= gridster.maxRows;
                    if (canOccupy && (gridster.pushing !== false || gridster.getItems(row, col, sizeX, sizeY, item).length === 0)) {
                        item.row = row;
                        item.col = col;
                        item.sizeX = sizeX;
                        item.sizeY = sizeY;
                    }
                    var isChanged = item.row !== oldRow || item.col !== oldCol || item.sizeX !== oldSizeX || item.sizeY !== oldSizeY;

                    if (hasCallback || isChanged) {
                        scope.$apply(function() {
                            if (hasCallback) {
                                gridster.resizable.resize(e, $el, itemOptions); // options is the item model
                            }
                        });
                    }
                }

                function resizeStop(e) {
                    $el.removeClass('gridster-item-moving');
                    $el.removeClass('gridster-item-resizing');

                    gridster.movingItem = null;

                    item.setPosition(item.row, item.col);
                    item.setSizeY(item.sizeY);
                    item.setSizeX(item.sizeX);

                    scope.$apply(function() {
                        if (gridster.resizable && gridster.resizable.stop) {
                            gridster.resizable.stop(e, $el, itemOptions); // options is the item model
                        }
                    });
                }

                var $dragHandle = null;
                var unifiedInput;

                this.enable = function() {
                    if (!$dragHandle) {
                        $dragHandle = angular.element('<div class="gridster-item-resizable-handler handle-' + hClass + '"></div>');
                        $el.append($dragHandle);
                    }

                    unifiedInput = new GridsterTouch($dragHandle[0], mouseDown, mouseMove, mouseUp);
                    unifiedInput.enable();
                };

                this.disable = function() {
                    if ($dragHandle) {
                        $dragHandle.remove();
                        $dragHandle = null;
                    }

                    unifiedInput.disable();
                    unifiedInput = undefined;
                };

                this.destroy = function() {
                    this.disable();
                };
            }

            var handles = [];
            var handlesOpts = gridster.resizable.handles;
            if (typeof handlesOpts === 'string') {
                handlesOpts = gridster.resizable.handles.split(',');
            }
            var enabled = false;

            for (var c = 0, l = handlesOpts.length; c < l; c++) {
                handles.push(new ResizeHandle(handlesOpts[c]));
            }

            this.enable = function() {
                if (enabled) {
                    return;
                }
                for (var c = 0, l = handles.length; c < l; c++) {
                    handles[c].enable();
                }
                enabled = true;
            };

            this.disable = function() {
                if (!enabled) {
                    return;
                }
                for (var c = 0, l = handles.length; c < l; c++) {
                    handles[c].disable();
                }
                enabled = false;
            };

            this.toggle = function(enabled) {
                if (enabled) {
                    this.enable();
                } else {
                    this.disable();
                }
            };

            this.destroy = function() {
                for (var c = 0, l = handles.length; c < l; c++) {
                    handles[c].destroy();
                }
            };
        }
        return GridsterResizable;
    }])

    .factory('gridsterDebounce', function() {
        return function gridsterDebounce(func, wait, immediate) {
            var timeout;
            return function() {
                var context = this,
                    args = arguments;
                var later = function() {
                    timeout = null;
                    if (!immediate) {
                        func.apply(context, args);
                    }
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) {
                    func.apply(context, args);
                }
            };
        };
    })

    /**
     * GridsterItem directive
     * @param $parse
     * @param GridsterDraggable
     * @param GridsterResizable
     * @param gridsterDebounce
     */
    .directive('gridsterItem', ['$parse', 'GridsterDraggable', 'GridsterResizable', 'gridsterDebounce',
        function($parse, GridsterDraggable, GridsterResizable, gridsterDebounce) {
            return {
                scope: true,
                restrict: 'EA',
                controller: 'GridsterItemCtrl',
                controllerAs: 'gridsterItem',
                require: ['^gridster', 'gridsterItem'],
                link: function(scope, $el, attrs, controllers) {
                    var optionsKey = attrs.gridsterItem,
                        options;

                    var gridster = controllers[0],
                        item = controllers[1];

                    scope.gridster = gridster;

                    // bind the item's position properties
                    // options can be an object specified by gridster-item="object"
                    // or the options can be the element html attributes object
                    if (optionsKey) {
                        var $optionsGetter = $parse(optionsKey);
                        options = $optionsGetter(scope) || {};
                        if (!options && $optionsGetter.assign) {
                            options = {
                                row: item.row,
                                col: item.col,
                                sizeX: item.sizeX,
                                sizeY: item.sizeY,
                                minSizeX: 0,
                                minSizeY: 0,
                                maxSizeX: null,
                                maxSizeY: null
                            };
                            $optionsGetter.assign(scope, options);
                        }
                    } else {
                        options = attrs;
                    }

                    item.init($el, gridster);

                    $el.addClass('gridster-item');

                    var aspects = ['minSizeX', 'maxSizeX', 'minSizeY', 'maxSizeY', 'sizeX', 'sizeY', 'row', 'col'],
                        $getters = {};

                    var expressions = [];
                    var aspectFn = function(aspect) {
                        var expression;
                        if (typeof options[aspect] === 'string') {
                            // watch the expression in the scope
                            expression = options[aspect];
                        } else if (typeof options[aspect.toLowerCase()] === 'string') {
                            // watch the expression in the scope
                            expression = options[aspect.toLowerCase()];
                        } else if (optionsKey) {
                            // watch the expression on the options object in the scope
                            expression = optionsKey + '.' + aspect;
                        } else {
                            return;
                        }
                        expressions.push('"' + aspect + '":' + expression);
                        $getters[aspect] = $parse(expression);

                        // initial set
                        var val = $getters[aspect](scope);
                        if (typeof val === 'number') {
                            item[aspect] = val;
                        }
                    };

                    for (var i = 0, l = aspects.length; i < l; ++i) {
                        aspectFn(aspects[i]);
                    }

                    var watchExpressions = '{' + expressions.join(',') + '}';
                    // when the value changes externally, update the internal item object
                    scope.$watchCollection(watchExpressions, function(newVals, oldVals) {
                        for (var aspect in newVals) {
                            var newVal = newVals[aspect];
                            var oldVal = oldVals[aspect];
                            if (oldVal === newVal) {
                                continue;
                            }
                            newVal = parseInt(newVal, 10);
                            if (!isNaN(newVal)) {
                                item[aspect] = newVal;
                            }
                        }
                    });

                    function positionChanged() {
                        // call setPosition so the element and gridster controller are updated
                        item.setPosition(item.row, item.col);

                        // when internal item position changes, update externally bound values
                        if ($getters.row && $getters.row.assign) {
                            $getters.row.assign(scope, item.row);
                        }
                        if ($getters.col && $getters.col.assign) {
                            $getters.col.assign(scope, item.col);
                        }
                    }
                    scope.$watch(function() {
                        return item.row + ',' + item.col;
                    }, positionChanged);

                    function sizeChanged() {
                        var changedX = item.setSizeX(item.sizeX, true);
                        if (changedX && $getters.sizeX && $getters.sizeX.assign) {
                            $getters.sizeX.assign(scope, item.sizeX);
                        }
                        var changedY = item.setSizeY(item.sizeY, true);
                        if (changedY && $getters.sizeY && $getters.sizeY.assign) {
                            $getters.sizeY.assign(scope, item.sizeY);
                        }

                        if (changedX || changedY) {
                            item.gridster.moveOverlappingItems(item);
                            gridster.layoutChanged();
                            scope.$broadcast('gridster-item-resized', item);
                        }
                    }

                    scope.$watch(function() {
                        return item.sizeY + ',' + item.sizeX + ',' + item.minSizeX + ',' + item.maxSizeX + ',' + item.minSizeY + ',' + item.maxSizeY;
                    }, sizeChanged);

                    var draggable = new GridsterDraggable($el, scope, gridster, item, options);
                    var resizable = new GridsterResizable($el, scope, gridster, item, options);

                    var updateResizable = function() {
                        resizable.toggle(!gridster.isMobile && gridster.resizable && gridster.resizable.enabled);
                    };
                    updateResizable();

                    var updateDraggable = function() {
                        draggable.toggle(!gridster.isMobile && gridster.draggable && gridster.draggable.enabled);
                    };
                    updateDraggable();

                    scope.$on('gridster-draggable-changed', updateDraggable);
                    scope.$on('gridster-resizable-changed', updateResizable);
                    scope.$on('gridster-resized', updateResizable);
                    scope.$on('gridster-mobile-changed', function() {
                        updateResizable();
                        updateDraggable();
                    });

                    function whichTransitionEvent() {
                        var el = document.createElement('div');
                        var transitions = {
                            'transition': 'transitionend',
                            'OTransition': 'oTransitionEnd',
                            'MozTransition': 'transitionend',
                            'WebkitTransition': 'webkitTransitionEnd'
                        };
                        for (var t in transitions) {
                            if (el.style[t] !== undefined) {
                                return transitions[t];
                            }
                        }
                    }

                    var debouncedTransitionEndPublisher = gridsterDebounce(function() {
                        scope.$apply(function() {
                            scope.$broadcast('gridster-item-transition-end', item);
                        });
                    }, 50);

                    $el.on(whichTransitionEvent(), debouncedTransitionEndPublisher);

                    scope.$broadcast('gridster-item-initialized', item);

                    return scope.$on('$destroy', function() {
                        try {
                            resizable.destroy();
                            draggable.destroy();
                        } catch (e) {}

                        try {
                            gridster.removeItem(item);
                        } catch (e) {}

                        try {
                            item.destroy();
                        } catch (e) {}
                    });
                }
            };
        }
    ])

    .directive('gridsterNoDrag', function() {
        return {
            restrict: 'A',
            link: function(scope, $element) {
                $element.addClass('gridster-no-drag');
            }
        };
    })

    ;

}));



}


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