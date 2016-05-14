/**
 * Created by egavard on 14/05/16.
 */
import {Injectable} from '@angular/core'
import {GridsterItem} from './gridster';
import {Gridster} from './gridster.component';
@Injectable()
export class GridsterDraggableService{
    private _item:GridsterItem;
    
    private _gridster:Gridster;
    private _inputTags:Array<string> = ['select','option','input', 'textarea','button'];
    private lastMouseX:number;
    private lastMouseY:number;

    private elmX:number;
    private elmY:number;
    private elmW:number;
    private elmH:number;

    private originalCol:number;
    private originalRow:number;
    private mOffX:number;
    private mOffY:number;
    private realdocument:any = window.document;
    
    mouseDown(e:any){
        let target = e.target;
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
    }

    mouseMove(e) {
        if (!$el.hasClass('gridster-item-moving') || $el.hasClass('gridster-item-resizing')) {
            return false;
        }

        var maxLeft = this.gridster.curWidth - 1;

        // Get the current mouse position.
        let mouseX = e.pageX;
        let mouseY = e.pageY;

        // Get the deltas
        var diffX = mouseX - this.lastMouseX + this.mOffX;
        var diffY = mouseY - this.lastMouseY + this.mOffY;
        this.mOffX = this.mOffY = 0;

        // Update last processed mouse positions.
        this.lastMouseX = mouseX;
        this.lastMouseY = mouseY;

        var dX = diffX,
            dY = diffY;
        if (this.elmX + dX < minLeft) {
            diffX = minLeft - this.elmX;
            this.mOffX = dX - diffX;
        } else if (this.elmX + this.elmW + dX > maxLeft) {
            diffX = maxLeft - this.elmX - this.elmW;
            this.mOffX = dX - diffX;
        }

        if (this.elmY + dY < minTop) {
            diffY = minTop - this.elmY;
            this.mOffY = dY - diffY;
        } else if (this.elmY + this.elmH + dY > maxTop) {
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
    }

    mouseUp(e) {
        if (!$el.hasClass('gridster-item-moving') || $el.hasClass('gridster-item-resizing')) {
            return false;
        }

        this.mOffX = this.mOffY = 0;

        this.dragStop(e);

        return true;
    }

    dragStart(event) {
        $el.addClass('gridster-item-moving');
        this.gridster.movingItem = this.item;

        this.gridster.updateHeight(this.item.sizeY);

        if (this.gridster.draggable && this.gridster.draggable.start) {
            this.gridster.draggable.start(event, $el, this.itemOptions);
        }

    }

    drag(event) {
        var oldRow = this.item.row,
            oldCol = this.item.col,
            hasCallback = this.gridster.draggable && this.gridster.draggable.drag,
            scrollSensitivity = this.gridster.draggable.scrollSensitivity,
            scrollSpeed = this.gridster.draggable.scrollSpeed;

        var row = this.gridster.pixelsToRows(this.elmY);
        var col = this.gridster.pixelsToColumns(this.elmX);

        var itemsInTheWay = this.gridster.getItems(row, col, this.item.sizeX, this.item.sizeY, [this.item]);
        var hasItemsInTheWay = itemsInTheWay.length !== 0;

        if (this.gridster.swapping === true && hasItemsInTheWay) {
            var boundingBoxItem = this.gridster.getBoundingBox(itemsInTheWay),
                sameSize = boundingBoxItem.sizeX === this.item.sizeX && boundingBoxItem.sizeY === this.item.sizeY,
                sameRow = boundingBoxItem.row === oldRow,
                sameCol = boundingBoxItem.col === oldCol,
                samePosition = boundingBoxItem.row === row && boundingBoxItem.col === col,
                inline = sameRow || sameCol;

            if (sameSize && itemsInTheWay.length === 1) {
                if (samePosition) {
                    this.gridster.swapItems(this.item, itemsInTheWay[0]);
                } else if (inline) {
                    return;
                }
            } else if (boundingBoxItem.sizeX <= this.item.sizeX && boundingBoxItem.sizeY <= this.item.sizeY && inline) {
                var emptyRow = this.item.row <= row ? this.item.row : row + this.item.sizeY,
                    emptyCol = this.item.col <= col ? this.item.col : col + this.item.sizeX,
                    rowOffset = emptyRow - boundingBoxItem.row,
                    colOffset = emptyCol - boundingBoxItem.col;

                for (var i = 0, l = itemsInTheWay.length; i < l; ++i) {
                    var itemInTheWay = itemsInTheWay[i];

                    var itemsInFreeSpace = this.gridster.getItems(
                        itemInTheWay.row + rowOffset,
                        itemInTheWay.col + colOffset,
                        itemInTheWay.sizeX,
                        itemInTheWay.sizeY,
                        [this.item]
                    );

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
        } else if (window.innerHeight - (event.pageY - this.realdocument.body.scrollTop) < scrollSensitivity) {
            this.realdocument.body.scrollTop = this.realdocument.body.scrollTop + scrollSpeed;
        }

        if (event.pageX - this.realdocument.body.scrollLeft < scrollSensitivity) {
            this.realdocument.body.scrollLeft = this.realdocument.body.scrollLeft - scrollSpeed;
        } else if (window.innerWidth - (event.pageX - this.realdocument.body.scrollLeft) < scrollSensitivity) {
            this.realdocument.body.scrollLeft = this.realdocument.body.scrollLeft + scrollSpeed;
        }

        if (hasCallback || oldRow !== this.item.row || oldCol !== this.item.col) {
            if (hasCallback) {
                this.gridster.draggable.drag(event, $el, this.itemOptions);
            }
        }
    }

    dragStop(event) {
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
    }

    enable() {
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

    disable() {
        if (enabled === false) {
            return;
        }

        enabled = false;
        if (gridsterTouch) {
            gridsterTouch.disable();
        }
    };

    toggle(enabled) {
        if (enabled) {
            this.enable();
        } else {
            this.disable();
        }
    };

    this.destroy = function() {
    this.disable();
};

    get item():GridsterItem {
        return this._item;
    }

    set item(value:GridsterItem) {
        this._item = value;
    }

    get gridster():Gridster {
        return this._gridster;
    }

    set gridster(value:Gridster) {
        this._gridster = value;
    }

    get inputTags():string|string|string|string|string[] {
        return this._inputTags;
    }

    set inputTags(value:Array<string>) {
        this._inputTags = value;
    }
}
@Injectable()
export class GridsterResizableService{

}