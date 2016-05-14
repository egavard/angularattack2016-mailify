import {Component, AfterViewInit} from "@angular/core";
import {CHART_DIRECTIVES} from "../../libs/ng2-charts-upgrade-rc1/components/charts/charts";
import {ColorPickerDirective} from "../../libs/color-picker/color-picker.directive";
import {DebugModule} from "../../modules/debug-module.component";
import {DataProviderService} from "../../services/data-provider.service";
import {ChartModule} from "../../modules/chart-module.component";
import {TableModule} from "../../modules/table-module.component";
import {HealthModule} from "../../modules/health-module.component";

@Component({
    selector: 'home',
    templateUrl: './app/dashboard/home/home.html',
    directives:[ DebugModule, ChartModule, TableModule, HealthModule, CHART_DIRECTIVES, ColorPickerDirective]
})
export class HomeComponent implements AfterViewInit {

    ngAfterViewInit(){
    }

    constructor(){

    }


}