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
var gridster_component_1 = require('./gridster.component');
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
/**
 * Created by egavard on 14/05/16.
 */
var GridsterPreview = (function () {
    function GridsterPreview() {
    }
    GridsterPreview.prototype.previewStyle = function () {
        if (this.gridster) {
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
    };
    __decorate([
        core_1.Input, 
        __metadata('design:type', gridster_component_1.Gridster)
    ], GridsterPreview.prototype, "gridster", void 0);
    GridsterPreview = __decorate([
        core_1.Component({
            selector: 'gridster-preview',
            template: "<div [ngStyle]=\"previewStyle()\" class=\"gridster-item gridster-preview-holder\"></div>",
            directives: [common_1.COMMON_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [])
    ], GridsterPreview);
    return GridsterPreview;
}());
exports.GridsterPreview = GridsterPreview;
//# sourceMappingURL=gridster-preview.component.js.map