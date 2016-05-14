import {ModuleMetadata} from "./module-metadata.model";
import {DebugModule} from "./debug-module.component";

export class DebugModuleMetadata implements ModuleMetadata {
    getIcon() {
        return "fa-bug";
    }

    getName() {
        return "Debug Module";
    }

    getType(){
        return DebugModule;
    }
}