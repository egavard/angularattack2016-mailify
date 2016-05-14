import {ModuleMetadata} from "./module-metadata.model";

export interface Module {
    getModuleMetadata: () => ModuleMetadata;
}