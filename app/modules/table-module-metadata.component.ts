import {ModuleMetadata} from "./module-metadata.model";
import {TableModule} from "./table-module.component";

export class TableModuleMetadata implements ModuleMetadata {

    getIcon() {
        return 'fa-table';
    }

    getName() {
        return 'Table Module';
    }

    getType() {
        return TableModule;
    }

}