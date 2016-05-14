import {Component, Input} from '@angular/core';
import {GridsterItem} from '../libs/gridster/gridster';
import { MODAL_DIRECTIVES, ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import {Module} from "./module";
import {DebugModuleMetadata} from "./debug-module-metadata.model";

@Component({
    selector: 'debug-module',
    templateUrl: './app/modules/debug-module.html',
    directives: [MODAL_DIRECTIVES],
})
export class DebugModule extends GridsterItem implements Module {
    @Input() readOnly:boolean;
    @Input() sizeX:number = 1;
    @Input() sizeY:number = 1;
    @Input() row:number = 1;
    @Input() col:number = 1;

    constructor() {
        super();
        this.readOnly = true;
    }

    edit() {
        console.log("bak");
    }

    getModuleMetadata() {
        return DebugModuleMetadata;
    }
}