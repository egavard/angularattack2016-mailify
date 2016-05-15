import {Injectable} from '@angular/core';
import {ModuleMetadata} from "../modules/module-metadata.model.ts";
import {ChartModuleMetadata, ChartType} from "../modules/chart-module-metadata.model";

@Injectable()
export class ModulesService {
    private modulesMetadata: ModuleMetadata[];

    constructor() {
        this.modulesMetadata = [
            new ChartModuleMetadata("fa-bug", "Debug Chart", ChartType.DEBUG),
            new ChartModuleMetadata("fa-line-chart", "Line Chart", ChartType.LINE),
            new ChartModuleMetadata("fa-bar-chart", "Bar Chart", ChartType.BAR),
            new ChartModuleMetadata("fa-table", "Table Chart", ChartType.TABLE),
            new ChartModuleMetadata("fa-heart", "Heart Chart", ChartType.HEALTH),
        ];
    }
    
    getAvailableModules(): ModuleMetadata[] {
        return this.modulesMetadata;
    }
}