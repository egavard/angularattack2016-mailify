import {ModuleMetadata} from "./module-metadata.model";

export interface Module {
    readOnly: boolean;
    getModuleMetadata: () => ModuleMetadata;
    /**
     * used to serialize and save a module's custom config
     */
    getConfig: () => any;

    setConfig: void;
}