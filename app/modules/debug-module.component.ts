import {Component, Input} from '@angular/core';
import {GridsterItem} from '../libs/gridster/gridster';
import { MODAL_DIRECTIVES } from 'ng2-bs3-modal/ng2-bs3-modal';
import {Module} from "./module";

@Component({
    selector: 'debug-module',
    templateUrl: './app/modules/debug-module.html',
    directives: [MODAL_DIRECTIVES],
})
export class DebugModule extends GridsterItem implements Module {
    @Input() readOnly:boolean;

    constructor() {
        super();
        this.readOnly = true;
    }
    moduleData:any = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum eros in nunc varius dapibus. Aliquam vel aliquam ante. Vivamus euismod tortor vel tincidunt gravida. Etiam enim velit, consectetur non eleifend in, lobortis sed quam. Vivamus imperdiet odio efficitur leo ultricies ullamcorper. Quisque congue elit in est lobortis, eget accumsan eros rhoncus. Cras congue quam et arcu scelerisque, ut hendrerit turpis ultrices. Praesent quis magna nec massa lacinia porttitor. Proin tristique, ipsum quis varius aliquam, justo nunc molestie sem, quis tristique leo magna at leo. Nullam dapibus efficitur auctor."

    getModuleMetadata() {
        return null;
    }
}