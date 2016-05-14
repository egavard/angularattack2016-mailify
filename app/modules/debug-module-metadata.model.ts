import {ModuleMetadata} from "./module-metadata.model";

export class DebugModuleMetadata implements ModuleMetadata {
    getIcon() {
        return "fa-bug";
    }

    getName() {
        return "Debug Module";
    }
}