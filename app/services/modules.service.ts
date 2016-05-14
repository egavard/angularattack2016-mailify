import {Injectable} from '@angular/core';
import {ModuleMetadata} from "../modules/module-metadata.model.ts";
import {DebugModuleMetadata} from "../modules/debug-module-metadata.model";

@Injectable()
export class ModulesService {
    private modulesMetadata: ModuleMetadata[];

    constructor() {
        this.modulesMetadata = [
            new DebugModuleMetadata()
        ];
    }
    
    getAvailableModules(): ModuleMetadata[] {
        return this.modulesMetadata;
    }
}