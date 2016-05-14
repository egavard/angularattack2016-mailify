import {ModuleMetadata} from "./module-metadata.model";

export interface Module {
    readOnly: boolean;

    getModuleMetadata: () => ModuleMetadata;
}