import {Component, AfterViewInit} from "@angular/core";
import {CHART_DIRECTIVES} from "../../libs/ng2-charts-upgrade-rc1/components/charts/charts";
import {ColorPickerDirective} from "../../libs/color-picker/color-picker.directive";
import {DataProviderService} from "../../services/data-provider.service";
import {ChartModule} from "../../modules/chart-module.component";
import {ChartPositionInformation} from '../../modules/chart-position-information';
import {NgGrid, NgGridItem} from 'angular2-grid/dist/NgGrid';
import {ModuleConfigService} from "../../services/module-config.service";

@Component({
    selector: 'home',
    templateUrl: './app/dashboard/home/home.html',
    directives:[ ChartModule, CHART_DIRECTIVES, ColorPickerDirective, NgGrid, NgGridItem]
})
export class HomeComponent implements AfterViewInit {
    
    private items:ChartModule[];
    
    ngAfterViewInit(){
    }

    constructor(dataService:DataProviderService, moduleConfigService: ModuleConfigService){
        let savedConfigs = moduleConfigService.currentConfig;
        this.items = [];
        if (savedConfigs) {
            for (let conf of savedConfigs) {
                let module = new ChartModule(dataService, conf.innerType);
                module.chartType = conf.type;
                module.chartColors = conf.colors;
                module.chartPositionInformation = conf.position;
                this.items.push(module);
            }
        } else {
        let debugModule = new ChartModule(dataService,'DebugModule');
        debugModule.chartPositionInformation = new ChartPositionInformation(1,1,5,1);
        let barModule = new ChartModule(dataService,'ChartModule');
            barModule.chartType = 'bar';
            barModule.chartPositionInformation = new ChartPositionInformation(1, 1, 1, 1);
        let chartModule = new ChartModule(dataService,'ChartModule');
            chartModule.chartType = 'line';
            chartModule.chartPositionInformation = new ChartPositionInformation(1, 1, 1, 1);

        this.items.push(debugModule, chartModule, barModule);
        }
        
    }


}