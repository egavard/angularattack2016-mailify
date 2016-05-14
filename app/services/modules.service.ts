import {Injectable} from '@angular/core';
import {ModuleMetadata} from "../modules/module-metadata.model.ts";
import {DebugModuleMetadata} from "../modules/debug-module-metadata.model";
import {ChartModuleMetadata, ChartType} from "../modules/chart-module-metadata.model";

@Injectable()
export class ModulesService {
    private modulesMetadata: ModuleMetadata[];

    constructor() {
        this.modulesMetadata = [
            new DebugModuleMetadata(),
            new ChartModuleMetadata("fa-line-chart", "Chart Line", ChartType.LINE),
            new ChartModuleMetadata("fa-bar-chart", "Chart Bar", ChartType.BAR),
        ];
    }
    
    getAvailableModules(): ModuleMetadata[] {
        return this.modulesMetadata;
    }
}