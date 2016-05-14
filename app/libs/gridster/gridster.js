"use strict";
/**
 * Created by egavard on 14/05/16.
 */
var GridsterResizable = (function () {
    function GridsterResizable() {
        this._enabled = true;
        this._handles = ['s', 'e', 'n', 'w', 'se', 'ne', 'sw', 'nw'];
    }
    Object.defineProperty(GridsterResizable.prototype, "enabled", {
        get: function () {
            return this._enabled;
        },
        set: function (value) {
            this._enabled = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridsterResizable.prototype, "handles", {
        get: function () {
            return this._handles;
        },
        set: function (value) {
            this._handles = value;
        },
        enumerable: true,
        configurable: true
    });
    return GridsterResizable;
}());
exports.GridsterResizable = GridsterResizable;
var GridsterDraggable = (function () {
    function GridsterDraggable() {
        this._enabled = true;
        this._scrollSensitivity = 20;
        this._scrollSpeed = 15;
    }
    Object.defineProperty(GridsterDraggable.prototype, "enabled", {
        get: function () {
            return this._enabled;
        },
        set: function (value) {
            this._enabled = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridsterDraggable.prototype, "scrollSensitivity", {
        get: function () {
            return this._scrollSensitivity;
        },
        set: function (value) {
            this._scrollSensitivity = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridsterDraggable.prototype, "scrollSpeed", {
        get: function () {
            return this._scrollSpeed;
        },
        set: function (value) {
            this._scrollSpeed = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridsterDraggable.prototype, "handle", {
        get: function () {
            return this._handle;
        },
        set: function (value) {
            this._handle = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridsterDraggable.prototype, "start", {
        get: function () {
            return this._start;
        },
        set: function (value) {
            this._start = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridsterDraggable.prototype, "drag", {
        get: function () {
            return this._drag;
        },
        set: function (value) {
            this._drag = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridsterDraggable.prototype, "stop", {
        get: function () {
            return this._stop;
        },
        set: function (value) {
            this._stop = value;
        },
        enumerable: true,
        configurable: true
    });
    return GridsterDraggable;
}());
exports.GridsterDraggable = GridsterDraggable;
/**
 * Should be implemented by every single module !
 */
var GridsterItem = (function () {
    function GridsterItem(gridster) {
        this._gridster = null;
        this._minSizeX = 0;
        this._minSizeY = 0;
        this._maxSizeX = null;
        this._maxSizeY = null;
        this._gridster = gridster;
        this.mapStyle = new Map();
        this.sizeX = this._gridster.defaultSizeX;
        this.sizeY = this._gridster.defaultSizeY;
    }
    GridsterItem.prototype.destroy = function () {
        // set these to null to avoid the possibility of circular references
        this._gridster = null;
        //TODO check native element method to remove an HTML node
    };
    ;
    /**
     * Returns the grid most important attributes
     */
    GridsterItem.prototype.toJSON = function () {
        return {
            row: this.row,
            col: this.col,
            sizeY: this.sizeY,
            sizeX: this.sizeX
        };
    };
    ;
    GridsterItem.prototype.isMoving = function () {
        return this._gridster.movingItem === this;
    };
    ;
    /**
     * Set the grid position
     *
     * @param {Number} row
     * @param {Number} column
     */
    GridsterItem.prototype.setPosition = function (row, column) {
        this._gridster.putItem(this, row, column);
        if (!this.isMoving()) {
            this.setElementPosition();
        }
    };
    ;
    /**
     * Sets a specified size property
     *
     * @param {String} key Can be either "x" or "y"
     * @param {Number} value The size amount
     * @param {Boolean} preventMove
     */
    GridsterItem.prototype.setSize = function (key, value, preventMove) {
        key = key.toUpperCase();
        var camelCase = 'size' + key, titleCase = 'Size' + key;
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
        }
        else if (key === 'Y' && this.rows) {
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
    ;
    /**
     * Sets the grid sizeY property
     *
     * @param {Number} rows
     * @param {Boolean} preventMove
     */
    GridsterItem.prototype.setSizeY = function (rows, preventMove) {
        return this.setSize('Y', rows, preventMove);
    };
    ;
    /**
     * Sets the grid sizeX property
     *
     * @param {Number} columns
     * @param {Boolean} preventMove
     */
    GridsterItem.prototype.setSizeX = function (columns, preventMove) {
        return this.setSize('X', columns, preventMove);
    };
    ;
    /**
     * Sets an elements position on the page
     */
    GridsterItem.prototype.setElementPosition = function () {
        if (this._gridster.isMobile) {
            this.mapStyle.set('marginLeft', this._gridster.margins[0] + 'px');
            this.mapStyle.set('marginRight', this._gridster.margins[0] + 'px');
            this.mapStyle.set('marginTop', this._gridster.margins[1] + 'px');
            this.mapStyle.set('marginBottom', this._gridster.margins[1] + 'px');
            this.mapStyle.set('top', '');
            this.mapStyle.set('left', '');
        }
        else {
            this.mapStyle.set('margin', '0');
            this.mapStyle.set('top', (this.row * this._gridster.curRowHeight + (this._gridster.outerMargin ? this._gridster.margins[0] : 0)) + 'px');
            this.mapStyle.set('left', (this.col * this._gridster.curColWidth + (this._gridster.outerMargin ? this._gridster.margins[1] : 0)) + 'px');
        }
    };
    ;
    /**
     * Sets an elements height
     */
    GridsterItem.prototype.setElementSizeY = function () {
        if (this._gridster.isMobile && !this._gridster.saveGridItemCalculatedHeightInMobile) {
            this.mapStyle.set('height', '');
        }
        else {
            this.mapStyle.set('height', (this.sizeY * this._gridster.curRowHeight - this._gridster.margins[0]) + 'px');
        }
    };
    ;
    /**
     * Sets an elements width
     */
    GridsterItem.prototype.setElementSizeX = function () {
        if (this._gridster.isMobile) {
            this.mapStyle.set('width', '');
        }
        else {
            this.mapStyle.set('width', (this.sizeX * this._gridster.curColWidth - this._gridster.margins[1]) + 'px');
        }
    };
    ;
    /**
     * Gets an element's width
     */
    GridsterItem.prototype.getElementSizeX = function () {
        return (this.sizeX * this._gridster.curColWidth - this._gridster.margins[1]);
    };
    ;
    /**
     * Gets an element's height
     */
    GridsterItem.prototype.getElementSizeY = function () {
        return (this.sizeY * this._gridster.curRowHeight - this._gridster.margins[0]);
    };
    ;
    Object.defineProperty(GridsterItem.prototype, "gridster", {
        get: function () {
            return this._gridster;
        },
        set: function (value) {
            this._gridster = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridsterItem.prototype, "sizeX", {
        get: function () {
            return this._sizeX;
        },
        set: function (value) {
            this._sizeX = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridsterItem.prototype, "sizeY", {
        get: function () {
            return this._sizeY;
        },
        set: function (value) {
            this._sizeY = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridsterItem.prototype, "row", {
        get: function () {
            return this._row;
        },
        set: function (value) {
            this._row = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridsterItem.prototype, "col", {
        get: function () {
            return this._col;
        },
        set: function (value) {
            this._col = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridsterItem.prototype, "oldRow", {
        get: function () {
            return this._oldRow;
        },
        set: function (value) {
            this._oldRow = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridsterItem.prototype, "oldColumn", {
        get: function () {
            return this._oldColumn;
        },
        set: function (value) {
            this._oldColumn = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridsterItem.prototype, "minSizeX", {
        get: function () {
            return this._minSizeX;
        },
        set: function (value) {
            this._minSizeX = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridsterItem.prototype, "minSizeY", {
        get: function () {
            return this._minSizeY;
        },
        set: function (value) {
            this._minSizeY = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridsterItem.prototype, "maxSizeX", {
        get: function () {
            return this._maxSizeX;
        },
        set: function (value) {
            this._maxSizeX = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridsterItem.prototype, "maxSizeY", {
        get: function () {
            return this._maxSizeY;
        },
        set: function (value) {
            this._maxSizeY = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridsterItem.prototype, "mapStyle", {
        get: function () {
            return this._mapStyle;
        },
        set: function (value) {
            this._mapStyle = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridsterItem.prototype, "cols", {
        get: function () {
            return this._cols;
        },
        set: function (value) {
            this._cols = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridsterItem.prototype, "rows", {
        get: function () {
            return this._rows;
        },
        set: function (value) {
            this._rows = value;
        },
        enumerable: true,
        configurable: true
    });
    return GridsterItem;
}());
exports.GridsterItem = GridsterItem;
//# sourceMappingURL=gridster.js.map