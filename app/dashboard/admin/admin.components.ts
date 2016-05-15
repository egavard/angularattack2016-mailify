import {Component} from '@angular/core';
import {ModulesService} from '../../services/modules.service';
import {ModuleMetadata} from '../../modules/module-metadata.model';
import {DebugModule} from '../../modules/debug-module.component';
import {AfterViewInit} from '@angular/core'
import {ChartModule} from '../../modules/chart-module.component';
import {DataProviderService} from '../../services/data-provider.service';
import {ChartPositionInformation} from '../../modules/chart-position-information';
import {NgGrid, NgGridItem} from 'angular2-grid/dist/NgGrid';
import {ChartType} from '../../modules/chart-module-metadata.model';
import {ModuleConfigService} from "../../services/module-config.service";
declare var $;

@Component({
    selector: 'home',
    templateUrl: './app/dashboard/admin/admin.html',
    directives: [DebugModule, ChartModule, NgGrid, NgGridItem]
})
export class AdminComponent implements AfterViewInit {
    private availableModules:ModuleMetadata[];
    private _items:ChartModule[];
    private _configId:string;
    private _savedConfig:string;

    constructor(private modulesService:ModulesService,
                private dataProviderService:DataProviderService,
                private moduleConfigService:ModuleConfigService) {
        this.availableModules = modulesService.getAvailableModules();

        let item1 = new ChartModule(dataProviderService);
        item1.chartPositionInformation = new ChartPositionInformation(0, 0, 5, 1);
        let item2 = new ChartModule(dataProviderService);
        item2.chartPositionInformation = new ChartPositionInformation(6, 0, 5, 1);

        this.items = [];
        this.items.push(item1, item2);
    }

    ngAfterViewInit() {
    }

    addNewModule(availableModule:ModuleMetadata) {
        let newModule;
        if (typeof(availableModule.getType) == ChartType) {
            newModule = new ChartModule(this.dataProviderService);
            switch (availableModule.getType) {
                case ChartType.BAR:
                    newModule.lineChartType = 'bar';
                    break;
                case ChartType.LINE:
                    newModule.lineChartType = 'line';
                    break;
            }
        } else {
            newModule = new availableModule.getType();
        }
        newModule.chartPositionInformation = new ChartPositionInformation(0, 0, 5, 1);
        this.items.push(newModule);
    }

    get items():ChartModule[] {
        return this._items;
    }

    set items(value:Array<ChartModule>) {
        this._items = value;
    }

    get configId():string {
        return this._configId;
    }

    set configId(value:string) {
        this._configId = value;
    }

    get savedConfig():string {
        return this._savedConfig;
    }

    set savedConfig(value:string) {
        this._savedConfig = value;
    }

    saveCurrentConfig() {
        this.moduleConfigService.saveConfig(this._configId, this._items)
            .subscribe(() => {
                this.loadConfig()
            });
    }

    loadConfig() {
        this.moduleConfigService.getConfigById(this._configId)
            .subscribe(config => this._items = config);
    }
}