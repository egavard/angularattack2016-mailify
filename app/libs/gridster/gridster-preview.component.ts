import {Gridster} from './gridster.component';
import {Component, Input} from '@angular/core'
import {COMMON_DIRECTIVES} from '@angular/common'
/**
 * Created by egavard on 14/05/16.
 */
@Component({
    selector:'gridster-preview',
    template:`<div [ngStyle]="previewStyle()" class="gridster-item gridster-preview-holder"></div>`,
    directives:[COMMON_DIRECTIVES]
})
export class GridsterPreview {
    @Input gridster:Gridster;
    constructor(){}
    previewStyle() {
        if(this.gridster){
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
}
