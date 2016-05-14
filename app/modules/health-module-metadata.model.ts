import {ModuleMetadata} from "./module-metadata.model";
import {HealthModule} from "./health-module.component";
export class HealthModuleMetadata implements ModuleMetadata {
    getIcon() {
        return "fa-heart";
    }

    getName() {
        return "Health Module";
    }

    getType(){
        return HealthModule;
    }
}