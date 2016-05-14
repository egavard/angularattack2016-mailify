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
/**
 * Created by egavard on 14/05/16.
 */
var core_1 = require('@angular/core');
var gridster_1 = require('./gridster');
var gridster_component_1 = require('./gridster.component');
var GridsterDraggableService = (function () {
    function GridsterDraggableService() {
        this._inputTags = ['select', 'option', 'input', 'textarea', 'button'];
        this.realdocument = window.document;
    }
    GridsterDraggableService.prototype.mouseDown = function (e) {
        var target = e.target;
        if (this._inputTags.indexOf(target.nodeName.toLowerCase()) !== -1) {
            return false;
        }
        // exit, if a resize handle was hit
        if (target.className.indexOf('gridster-item-resizable-handler') != -1) {
            return false;
        }
        // exit, if the target has it's own click event
        if (target.onclick) {
            return false;
        }
        // apply drag handle filter
        if (this.gridster.draggable && this.gridster.draggable.handle) {
            var $dragHandles = angular.element($el[0].querySelectorAll(this.gridster.draggable.handle));
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
        this.lastMouseX = e.pageX;
        this.lastMouseY = e.pageY;
        this.elmX = parseInt($el.css('left'), 10);
        this.elmY = parseInt($el.css('top'), 10);
        this.elmW = $el[0].offsetWidth;
        this.elmH = $el[0].offsetHeight;
        this.originalCol = this.item.col;
        this.originalRow = this.item.row;
        this.dragStart(e);
        return true;
    };
    GridsterDraggableService.prototype.mouseMove = function (e) {
        if (!$el.hasClass('gridster-item-moving') || $el.hasClass('gridster-item-resizing')) {
            return false;
        }
        var maxLeft = this.gridster.curWidth - 1;
        // Get the current mouse position.
        var mouseX = e.pageX;
        var mouseY = e.pageY;
        // Get the deltas
        var diffX = mouseX - this.lastMouseX + this.mOffX;
        var diffY = mouseY - this.lastMouseY + this.mOffY;
        this.mOffX = this.mOffY = 0;
        // Update last processed mouse positions.
        this.lastMouseX = mouseX;
        this.lastMouseY = mouseY;
        var dX = diffX, dY = diffY;
        if (this.elmX + dX < minLeft) {
            diffX = minLeft - this.elmX;
            this.mOffX = dX - diffX;
        }
        else if (this.elmX + this.elmW + dX > maxLeft) {
            diffX = maxLeft - this.elmX - this.elmW;
            this.mOffX = dX - diffX;
        }
        if (this.elmY + dY < minTop) {
            diffY = minTop - this.elmY;
            this.mOffY = dY - diffY;
        }
        else if (this.elmY + this.elmH + dY > maxTop) {
            diffY = maxTop - this.elmY - this.elmH;
            this.mOffY = dY - diffY;
        }
        this.elmX += diffX;
        this.elmY += diffY;
        // set new position
        $el.css({
            'top': this.elmY + 'px',
            'left': this.elmX + 'px'
        });
        this.drag(e);
        return true;
    };
    GridsterDraggableService.prototype.mouseUp = function (e) {
        if (!$el.hasClass('gridster-item-moving') || $el.hasClass('gridster-item-resizing')) {
            return false;
        }
        this.mOffX = this.mOffY = 0;
        this.dragStop(e);
        return true;
    };
    GridsterDraggableService.prototype.dragStart = function (event) {
        $el.addClass('gridster-item-moving');
        this.gridster.movingItem = this.item;
        this.gridster.updateHeight(this.item.sizeY);
        if (this.gridster.draggable && this.gridster.draggable.start) {
            this.gridster.draggable.start(event, $el, this.itemOptions);
        }
    };
    GridsterDraggableService.prototype.drag = function (event) {
        var oldRow = this.item.row, oldCol = this.item.col, hasCallback = this.gridster.draggable && this.gridster.draggable.drag, scrollSensitivity = this.gridster.draggable.scrollSensitivity, scrollSpeed = this.gridster.draggable.scrollSpeed;
        var row = this.gridster.pixelsToRows(this.elmY);
        var col = this.gridster.pixelsToColumns(this.elmX);
        var itemsInTheWay = this.gridster.getItems(row, col, this.item.sizeX, this.item.sizeY, [this.item]);
        var hasItemsInTheWay = itemsInTheWay.length !== 0;
        if (this.gridster.swapping === true && hasItemsInTheWay) {
            var boundingBoxItem = this.gridster.getBoundingBox(itemsInTheWay), sameSize = boundingBoxItem.sizeX === this.item.sizeX && boundingBoxItem.sizeY === this.item.sizeY, sameRow = boundingBoxItem.row === oldRow, sameCol = boundingBoxItem.col === oldCol, samePosition = boundingBoxItem.row === row && boundingBoxItem.col === col, inline = sameRow || sameCol;
            if (sameSize && itemsInTheWay.length === 1) {
                if (samePosition) {
                    this.gridster.swapItems(this.item, itemsInTheWay[0]);
                }
                else if (inline) {
                    return;
                }
            }
            else if (boundingBoxItem.sizeX <= this.item.sizeX && boundingBoxItem.sizeY <= this.item.sizeY && inline) {
                var emptyRow = this.item.row <= row ? this.item.row : row + this.item.sizeY, emptyCol = this.item.col <= col ? this.item.col : col + this.item.sizeX, rowOffset = emptyRow - boundingBoxItem.row, colOffset = emptyCol - boundingBoxItem.col;
                for (var i = 0, l = itemsInTheWay.length; i < l; ++i) {
                    var itemInTheWay = itemsInTheWay[i];
                    var itemsInFreeSpace = this.gridster.getItems(itemInTheWay.row + rowOffset, itemInTheWay.col + colOffset, itemInTheWay.sizeX, itemInTheWay.sizeY, [this.item]);
                    if (itemsInFreeSpace.length === 0) {
                        this.gridster.putItem(itemInTheWay, itemInTheWay.row + rowOffset, itemInTheWay.col + colOffset);
                    }
                }
            }
        }
        if (this.gridster.pushing !== false || !hasItemsInTheWay) {
            this.item.row = row;
            this.item.col = col;
        }
        if (event.pageY - this.realdocument.body.scrollTop < scrollSensitivity) {
            this.realdocument.body.scrollTop = this.realdocument.body.scrollTop - scrollSpeed;
        }
        else if (window.innerHeight - (event.pageY - this.realdocument.body.scrollTop) < scrollSensitivity) {
            this.realdocument.body.scrollTop = this.realdocument.body.scrollTop + scrollSpeed;
        }
        if (event.pageX - this.realdocument.body.scrollLeft < scrollSensitivity) {
            this.realdocument.body.scrollLeft = this.realdocument.body.scrollLeft - scrollSpeed;
        }
        else if (window.innerWidth - (event.pageX - this.realdocument.body.scrollLeft) < scrollSensitivity) {
            this.realdocument.body.scrollLeft = this.realdocument.body.scrollLeft + scrollSpeed;
        }
        if (hasCallback || oldRow !== this.item.row || oldCol !== this.item.col) {
            if (hasCallback) {
                this.gridster.draggable.drag(event, $el, this.itemOptions);
            }
        }
    };
    GridsterDraggableService.prototype.dragStop = function (event) {
        $el.removeClass('gridster-item-moving');
        var row = this.gridster.pixelsToRows(this.elmY);
        var col = this.gridster.pixelsToColumns(this.elmX);
        if (this.gridster.pushing !== false || this.gridster.getItems(row, col, this.item.sizeX, this.item.sizeY, [this.item]).length === 0) {
            this.item.row = row;
            this.item.col = col;
        }
        this.gridster.movingItem = null;
        this.item.setPosition(this.item.row, this.item.col);
        if (this.gridster.draggable && this.gridster.draggable.stop) {
            this.gridster.draggable.stop(event, $el, this.itemOptions);
        }
    };
    GridsterDraggableService.prototype.enable = function () {
        if (this.enabled === true) {
            return;
        }
        this.enabled = true;
        if (this.gridsterTouch) {
            this.gridsterTouch.enable();
            return;
        }
        this.gridsterTouch = new GridsterTouch($el[0], this.mouseDown, this.mouseMove, this.mouseUp);
        this.gridsterTouch.enable();
    };
    ;
    GridsterDraggableService.prototype.disable = function () {
        if (enabled === false) {
            return;
        }
        enabled = false;
        if (gridsterTouch) {
            gridsterTouch.disable();
        }
    };
    ;
    GridsterDraggableService.prototype.toggle = function (enabled) {
        if (enabled) {
            this.enable();
        }
        else {
            this.disable();
        }
    };
    ;
    GridsterDraggableService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], GridsterDraggableService);
    return GridsterDraggableService;
}());
exports.GridsterDraggableService = GridsterDraggableService;
this.destroy = function () {
    this.disable();
};
get;
item();
gridster_1.GridsterItem;
{
    return this._item;
}
set;
item(value, gridster_1.GridsterItem);
{
    this._item = value;
}
get;
gridster();
gridster_component_1.Gridster;
{
    return this._gridster;
}
set;
gridster(value, gridster_component_1.Gridster);
{
    this._gridster = value;
}
get;
inputTags();
string | string | string | string | string[];
{
    return this._inputTags;
}
set;
inputTags(value, Array(), {
    this: ._inputTags = value
});
var GridsterResizableService = (function () {
    function GridsterResizableService() {
    }
    GridsterResizableService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], GridsterResizableService);
    return GridsterResizableService;
}());
exports.GridsterResizableService = GridsterResizableService;
//# sourceMappingURL=gridster.service.js.map