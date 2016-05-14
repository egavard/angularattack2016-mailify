import {ModuleMetadata} from "./module-metadata.model";

export class DebugModuleMetadata implements ModuleMetadata {
    getIcon() {
        return "fa-debug";
    }

    getName() {
        return "Debug Module";
    }
}