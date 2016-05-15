import {Component} from '@angular/core';
import {ModulesService} from '../../services/modules.service';
import {ModuleMetadata} from '../../modules/module-metadata.model';
import {DebugModule} from '../../modules/debug-module.component';
import {AfterViewInit} from '@angular/core'
import {ChartModule} from '../../modules/chart-module.component';
import {DataProviderService} from '../../services/data-provider.service';
import {ChartPositionInformation} from '../../modules/chart-position-information';
import {NgGrid, NgGridItem} from 'angular2-grid/dist/NgGrid';
import {ChartModuleMetadata, ChartType} from '../../modules/chart-module-metadata.model';
import {ModuleConfigService} from '../../services/module-config.service';

declare var $;

@Component({
    selector: 'home',
    templateUrl: './app/dashboard/admin/admin.html',
    directives: [DebugModule, ChartModule, NgGrid, NgGridItem]
})
export class AdminComponent implements AfterViewInit {
    private _availableModules:ModuleMetadata[];
    private _items:ChartModule[];
    private _configId:string;
    private _savedConfig:string;


    constructor(private modulesService: ModulesService, private dataProviderService:DataProviderService, private moduleConfigService:ModuleConfigService) {
        this._availableModules = modulesService.getAvailableModules();
        let storedItems = window.localStorage.getItem('charts');
        if(storedItems){
            this.items = storedItems;
        }else{
            let item1 = new ChartModule(dataProviderService, 'ChartModule');
        item1.chartPositionInformation = new ChartPositionInformation(0, 0, 5, 1);
            let item2 = new ChartModule(dataProviderService, 'HealthModule');
            item2.chartPositionInformation = new ChartPositionInformation(6,0,5,1);

            this.items = [];
            this.items.push(item1, item2);
    }
    }

    ngAfterViewInit() {
    }

    addNewModule(availableModule:ModuleMetadata) {
        let newModuleType:any = availableModule.getType();
        let newModuleInnerType:any;

        switch( (<ChartModuleMetadata>availableModule).getChartType()){
            case ChartType.BAR:newModuleInnerType = 'ChartModule';break;
            case ChartType.LINE:newModuleInnerType = 'ChartModule';break;
            case ChartType.DEBUG:newModuleInnerType = 'DebugModule';break;
            case ChartType.HEALTH:newModuleInnerType = 'HealthModule';break;
            case ChartType.TABLE:newModuleInnerType = 'TableModule';break;
            default: newModuleInnerType = 'ChartModule';break;
            }


        let newModule = new newModuleType(this.dataProviderService, newModuleInnerType);

        if(ChartModule == newModuleType){
            switch( (<ChartModuleMetadata>availableModule).getChartType()){
                case ChartType.BAR:newModule.lineChartType = 'bar';break;
                case ChartType.LINE:newModule.lineChartType = 'line';break;
        }
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

    get availableModules():Array<ModuleMetadata> {
        return this._availableModules;
    }

    set availableModules(value:Array<ModuleMetadata>) {
        this._availableModules = value;
    }

    saveCurrentConfig() {
        let configs = this._items.map(i => i.getConfig());
        this.moduleConfigService.saveConfig(this._configId, configs)
            .subscribe(() => {
                this.loadConfig()
            });
    }

    loadConfig() {
        this.moduleConfigService.getConfigById(this._configId)
            .subscribe(config => {
                if (config !== null) {
                    for (let i = 0; i < this._items.length; ++i) {
                        this._items[i].setConfig(config[i]);
                    }
                }
            });
    }
}