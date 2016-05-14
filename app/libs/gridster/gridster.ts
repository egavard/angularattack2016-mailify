/**
 * Created by egavard on 14/05/16.
 */
import {Gridster} from './gridster.component';
import {ElementRef} from '@angular/core'
export class GridsterResizable{
    private _enabled:boolean = true;
    private _handles:string[] = ['s', 'e', 'n', 'w', 'se', 'ne', 'sw', 'nw'];

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
    private enabled:boolean;
    private gridsterTouch:GridsterTouch;
    private itemOptions:any;
    private minLeft:number;
    private minTop:number;
    private maxTop:number;

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

        this.elmX = parseInt(this._item.element.style.left, 10);
        this.elmY = parseInt(this._item.element.style.top, 10);
        this.elmW = this._item.element.offsetWidth;
        this.elmH = this._item.element.offsetHeight;

        this.originalCol = this.item.col;
        this.originalRow = this.item.row;

        this.dragStart(e);

        return true;
    }

    mouseMove(e) {
        if (this.item.element.className.indexOf('gridster-item-moving') == -1 || this.item.element.className.indexOf('gridster-item-resizing') == -1) {
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
        if (this.elmX + dX < this.minLeft) {
            diffX = this.minLeft - this.elmX;
            this.mOffX = dX - diffX;
        } else if (this.elmX + this.elmW + dX > maxLeft) {
            diffX = maxLeft - this.elmX - this.elmW;
            this.mOffX = dX - diffX;
        }

        if (this.elmY + dY < this.minTop) {
            diffY = this.minTop - this.elmY;
            this.mOffY = dY - diffY;
        } else if (this.elmY + this.elmH + dY > this.maxTop) {
            diffY = this.maxTop - this.elmY - this.elmH;
            this.mOffY = dY - diffY;
        }
        this.elmX += diffX;
        this.elmY += diffY;

        // set new position

        this._item.element.style.top = this.elmY + 'px';
        this._item.element.style.left = this.elmX + 'px';


        this.drag(e);

        return true;
    }

    mouseUp(e) {
        if (this.item.element.className.indexOf('gridster-item-moving') == -1 || this.item.element.className.indexOf('gridster-item-resizing') == -1) {
            return false;
        }

        this.mOffX = this.mOffY = 0;

        this.dragStop(e);

        return true;
    }

    dragStart(event) {
        this.item.element.className += ' gridster-item-moving ';
        this.gridster.movingItem = this.item;

        this.gridster.updateHeight(this.item.sizeY);

        if (this.gridster.draggable && this.gridster.draggable.start) {
            this.gridster.draggable.start(event, this.item.element, this.itemOptions);
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
                this.gridster.draggable.drag(event, this.item.element, this.itemOptions);
            }
        }
    }

    dragStop(event) {
        this.item.element.className = this.item.element.className.replace('gridster-item-moving','');
        var row = this.gridster.pixelsToRows(this.elmY);
        var col = this.gridster.pixelsToColumns(this.elmX);
        if (this.gridster.pushing !== false || this.gridster.getItems(row, col, this.item.sizeX, this.item.sizeY, [this.item]).length === 0) {
            this.item.row = row;
            this.item.col = col;
        }
        this.gridster.movingItem = null;
        this.item.setPosition(this.item.row, this.item.col);


        if (this.gridster.draggable && this.gridster.draggable.stop) {
            this.gridster.draggable.stop(event, this.item.element, this.itemOptions);
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

        this.gridsterTouch = new GridsterTouch(this.item.element, this.mouseDown, this.mouseMove, this.mouseUp);
        this.gridsterTouch.enable();
    };

    disable() {
        if (this.enabled === false) {
            return;
        }

        this.enabled = false;
        if (this.gridsterTouch) {
            this.gridsterTouch.disable();
        }
    };

    toggle(enabled) {
        if (enabled) {
            this.enable();
        } else {
            this.disable();
        }
    };

    destroy = function() {
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

    get inputTags(): string[] {
        return this._inputTags;
    }

    set inputTags(value:Array<string>) {
        this._inputTags = value;
    }

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
    private _handle:any;
    private _start:any;
    private _drag:any;
    private _stop:any;


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

    get handle():any {
        return this._handle;
    }

    set setHandle(value:any) {
        this._handle = value;
    }

    get start():any {
        return this._start;
    }

    set setStart(value:any) {
        this._start = value;
    }

    get drag():any {
        return this._drag;
    }

    set setDrag(value:any) {
        this._drag = value;
    }

    get stop():any {
        return this._stop;
    }

    set setStop(value:any) {
        this._stop = value;
    }
}
/**
 * Should be implemented by every single module !
 */
export class GridsterItem{
    private _gridster:Gridster = null;

    private _sizeX:number = 1;
    private _sizeY:number = 1;
    private _row:number = 1;
    private _col:number = 1;
    private _oldRow:number;
    private _oldColumn:number;
    private _minSizeX:number = 0;
    private _minSizeY:number = 0;
    private _maxSizeX:number = null;
    private _maxSizeY:number = null;
    private _cols:number;
    private _rows:number;
    private _mapStyle:Map<String,String>;
    private _element:any;
    private _draggable:GridsterDraggable;
    private _resizable:GridsterResizable;

    constructor() {
        this.mapStyle = new Map<String,String>();
        this.sizeX = 1;
        this.sizeY = 1;
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

    get element():any {
        return this._element;
    }

    set element(value:any) {
        this._element = value;
    }

    get draggable():GridsterDraggable {
        return this._draggable;
    }

    set draggable(value:GridsterDraggable) {
        this._draggable = value;
    }

    get resizable():GridsterResizable {
        return this._resizable;
    }

    set resizable(value:GridsterResizable) {
        this._resizable = value;
    }
}
export class GridsterTouch{
    private lastXYById = {};
    private target:any;
    private documentToTargetDelta:any={};
    private useSetReleaseCapture:boolean = false;
    // saving the settings for contentZooming and touchaction before activation
    private contentZooming:any;
    private msTouchAction:any;
    private prevent:any = true;
    private pointerList:any;
    private endEvent:any;
    private startEvent:any;
    private moveEvent:any;



    constructor(element, mouseDown, mouseMove, mouseUp) {
        this.documentToTargetDelta = this.computeDocumentToElementDelta(this.target);
    }


    //  Opera doesn't have Object.keys so we use this wrapper
    numberOfKeys(theObject) {
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
    computeDocumentToElementDelta(theElement) {
        var elementLeft = 0;
        var elementTop = 0;
        var oldIEUserAgent = navigator.userAgent.match(/\bMSIE\b/);

        for (var offsetElement = theElement; offsetElement != null; offsetElement = offsetElement.offsetParent) {

            elementLeft += offsetElement.offsetLeft;
            elementTop += offsetElement.offsetTop;

        }

        return {
            x: elementLeft,
            y: elementTop
        };
    };

    //  cache the delta from the document to our event target (reinitialized each mousedown/MSPointerDown/touchstart)

    //  common event handler for the mouse/pointer/touch models and their down/start, move, up/end, and cancel events
    doEvent(theEvtObj) {

        if (theEvtObj.type === 'mousemove' && this.numberOfKeys(this.lastXYById) === 0) {
            return;
        }


        this.pointerList = theEvtObj.changedTouches ? theEvtObj.changedTouches : [theEvtObj];
        for (var i = 0; i < this.pointerList.length; ++i) {
            var pointerObj = this.pointerList[i];
            var pointerId = (typeof pointerObj.identifier !== 'undefined') ? pointerObj.identifier : (typeof pointerObj.pointerId !== 'undefined') ? pointerObj.pointerId : 1;

            var pageX = pointerObj.pageX;
            var pageY = pointerObj.pageY;

            if (theEvtObj.type.match(/(start|down)$/i)) {
                //  clause for processing MSPointerDown, touchstart, and mousedown

                //  refresh the document-to-target delta on start in case the target has moved relative to document
                this.documentToTargetDelta = this.computeDocumentToElementDelta(this.target);

                //  protect against failing to get an up or end on this pointerId
                if (this.lastXYById[pointerId]) {
                    if (this.endEvent) {
                        this.endEvent({
                            target: theEvtObj.target,
                            which: theEvtObj.which,
                            pointerId: pointerId,
                            pageX: pageX,
                            pageY: pageY
                        });
                    }

                    this.lastXYById[pointerId] = null;
                }

                if (this.startEvent) {
                    if (this.prevent) {
                        this.prevent = this.startEvent({
                            target: theEvtObj.target,
                            which: theEvtObj.which,
                            pointerId: pointerId,
                            pageX: pageX,
                            pageY: pageY
                        });
                    }
                }

                //  init last page positions for this pointer
                this.lastXYById[pointerId] = {
                    x: pageX,
                    y: pageY
                };

                // IE pointer model
                if (this.target.msSetPointerCapture) {
                    this.target.msSetPointerCapture(pointerId);
                } else if (theEvtObj.type === 'mousedown' && this.numberOfKeys(this.lastXYById) === 1) {
                    if (this.useSetReleaseCapture) {
                        this.target.setCapture(true);
                    } else {
                        document.addEventListener('mousemove', this.doEvent, false);
                        document.addEventListener('mouseup', this.doEvent, false);
                    }
                }
            } else if (theEvtObj.type.match(/move$/i)) {
                //  clause handles mousemove, MSPointerMove, and touchmove

                if (this.lastXYById[pointerId] && !(this.lastXYById[pointerId].x === pageX && this.lastXYById[pointerId].y === pageY)) {
                    //  only extend if the pointer is down and it's not the same as the last point

                    if (this.moveEvent && this.prevent) {
                        this.prevent = this.moveEvent({
                            target: theEvtObj.target,
                            which: theEvtObj.which,
                            pointerId: pointerId,
                            pageX: pageX,
                            pageY: pageY
                        });
                    }

                    //  update last page positions for this pointer
                    this.lastXYById[pointerId].x = pageX;
                    this.lastXYById[pointerId].y = pageY;
                }
            } else if (this.lastXYById[pointerId] && theEvtObj.type.match(/(up|end|cancel)$/i)) {
                //  clause handles up/end/cancel

                if (this.endEvent && this.prevent) {
                    this.prevent = this.endEvent({
                        target: theEvtObj.target,
                        which: theEvtObj.which,
                        pointerId: pointerId,
                        pageX: pageX,
                        pageY: pageY
                    });
                }

                //  delete last page positions for this pointer
                this.lastXYById[pointerId] = null;

                //  in the Microsoft pointer model, release the capture for this pointer
                //  in the mouse model, release the capture or remove document-level event handlers if there are no down points
                //  nothing is required for the iOS touch model because capture is implied on touchstart
                if (this.target.msReleasePointerCapture) {
                    this.target.msReleasePointerCapture(pointerId);
                } else if (theEvtObj.type === 'mouseup' && this.numberOfKeys(this.lastXYById) === 0) {
                    if (this.useSetReleaseCapture) {
                        this.target.releaseCapture();
                    } else {
                        document.removeEventListener('mousemove', this.doEvent, false);
                        document.removeEventListener('mouseup', this.doEvent, false);
                    }
                }
            }
        }

        if (this.prevent) {
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

    enable() {

        if (window.navigator.msPointerEnabled) {
            //  Microsoft pointer model
            this.target.addEventListener('MSPointerDown', this.doEvent, false);
            this.target.addEventListener('MSPointerMove', this.doEvent, false);
            this.target.addEventListener('MSPointerUp', this.doEvent, false);
            this.target.addEventListener('MSPointerCancel', this.doEvent, false);

            //  css way to prevent panning in our target area
            if (typeof this.target.style.msContentZooming !== 'undefined') {
                this.contentZooming = this.target.style.msContentZooming;
                this.target.style.msContentZooming = 'none';
            }

            //  new in Windows Consumer Preview: css way to prevent all built-in touch actions on our target
            //  without this, you cannot touch draw on the element because IE will intercept the touch events
            if (typeof this.target.style.msTouchAction !== 'undefined') {
                this.msTouchAction = this.target.style.msTouchAction;
                this.target.style.msTouchAction = 'none';
            }
        } else if (this.target.addEventListener) {
            //  iOS touch model
            this.target.addEventListener('touchstart', this.doEvent, false);
            this.target.addEventListener('touchmove', this.doEvent, false);
            this. target.addEventListener('touchend', this.doEvent, false);
            this.target.addEventListener('touchcancel', this.doEvent, false);

            //  mouse model
            this.target.addEventListener('mousedown', this.doEvent, false);

            //  mouse model with capture
            //  rejecting gecko because, unlike ie, firefox does not send events to target when the mouse is outside target
            if (this.target.setCapture && !window.navigator.userAgent.match(/\bGecko\b/)) {
                this.useSetReleaseCapture = true;

                this.target.addEventListener('mousemove', this.doEvent, false);
                this.target.addEventListener('mouseup', this.doEvent, false);
            }
        } else if (this.target.attachEvent && this.target.setCapture) {
            //  legacy IE mode - mouse with capture
            this.useSetReleaseCapture = true;
            this.target.attachEvent('onmousedown', function() {
                this.doEvent(window.event);
                window.event.returnValue = false;
                return false;
            });
            this.target.attachEvent('onmousemove', function() {
                this.doEvent(window.event);
                window.event.returnValue = false;
                return false;
            });
            this.target.attachEvent('onmouseup', function() {
                this.doEvent(window.event);
                window.event.returnValue = false;
                return false;
            });
        }
    };

    disable = function() {
        if (window.navigator.msPointerEnabled) {
            //  Microsoft pointer model
            this.target.removeEventListener('MSPointerDown', this.doEvent, false);
            this.target.removeEventListener('MSPointerMove', this.doEvent, false);
            this.target.removeEventListener('MSPointerUp', this.doEvent, false);
            this.target.removeEventListener('MSPointerCancel', this.doEvent, false);

            //  reset zooming to saved value
            if (this.contentZooming) {
                this.target.style.msContentZooming = this.contentZooming;
            }

            // reset touch action setting
            if (this.msTouchAction) {
                this.target.style.msTouchAction = this.msTouchAction;
            }
        } else if (this.target.removeEventListener) {
            //  iOS touch model
            this.target.removeEventListener('touchstart', this.doEvent, false);
            this.target.removeEventListener('touchmove', this.doEvent, false);
            this.target.removeEventListener('touchend', this.doEvent, false);
            this.target.removeEventListener('touchcancel', this.doEvent, false);

            //  mouse model
            this.target.removeEventListener('mousedown', this.doEvent, false);

            //  mouse model with capture
            //  rejecting gecko because, unlike ie, firefox does not send events to target when the mouse is outside target
            if (this.target.setCapture && !window.navigator.userAgent.match(/\bGecko\b/)) {
                this.useSetReleaseCapture = true;

                this.target.removeEventListener('mousemove', this.doEvent, false);
                this.target.removeEventListener('mouseup', this.doEvent, false);
            }
        } else if (this.target.detachEvent && this.target.setCapture) {
            //  legacy IE mode - mouse with capture
            this.useSetReleaseCapture = true;
            this.target.detachEvent('onmousedown');
            this.target.detachEvent('onmousemove');
            this.target.detachEvent('onmouseup');
        }
    };
}
