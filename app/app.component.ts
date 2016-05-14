/**
 * Created by egavard on 14/05/16.
 */
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import {Gridster} from './libs/gridster/gridster.component';
import {DebugModule} from './modules/debug-module.component';
import {DataProviderService} from './services/data-provider.service';
import {CHART_DIRECTIVES} from './libs/ng2-charts-upgrade-rc1/ng2-charts';
import {ColorPickerDirective} from './libs/color-picker/color-picker.directive'

@Component({
    selector:'app',
    moduleId:module.id,
    templateUrl:'./app.html',
    directives:[Gridster, CHART_DIRECTIVES, ColorPickerDirective]
})
export class AppComponent implements AfterViewInit {
    @ViewChild(Gridster) gridster:Gridster;
    
    ngAfterViewInit(){
        let debugModule:DebugModule = new DebugModule(this.gridster);
        debugModule.sizeX = 2;
        debugModule.sizeY = 1;
        debugModule.row = 0;
        debugModule.col = 0;
        this.gridster.putItem(debugModule);
    }
    constructor(private dataProviderService: DataProviderService){
        console.log(dataProviderService.getBasicChart());
        
    }



    private color: string = "#127bdc";



// lineChart
    private lineChartData:Array<any> = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90],
        [18, 48, 77, 9, 100, 27, 40]
    ];
    private lineChartLabels:Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    private lineChartSeries:Array<any> = ['Series A', 'Series B', 'Series C'];
    private lineChartOptions:any = {
        animation: false,
        responsive: true,
        multiTooltipTemplate: '<%if (datasetLabel){%><%=datasetLabel %>: <%}%><%= value %>'
    };
    private lineChartColours:Array<any> = [
        { // grey
            fillColor: 'rgba(148,159,177,0.2)',
            strokeColor: 'rgba(148,159,177,1)',
            pointColor: 'rgba(148,159,177,1)',
            pointStrokeColor: '#fff',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(148,159,177,0.8)'
        },
        { // dark grey
            fillColor: 'rgba(77,83,96,0.2)',
            strokeColor: 'rgba(77,83,96,1)',
            pointColor: 'rgba(77,83,96,1)',
            pointStrokeColor: '#fff',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(77,83,96,1)'
        },
        { // grey
            fillColor: 'rgba(148,159,177,0.2)',
            strokeColor: 'rgba(148,159,177,1)',
            pointColor: 'rgba(148,159,177,1)',
            pointStrokeColor: '#fff',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(148,159,177,0.8)'
        }
    ];
    private lineChartLegend:boolean = true;
    private lineChartType:string = 'radar';

    // events
    chartClicked(e:any) {
        console.log(e);
    }

    chartHovered(e:any) {
        console.log(e);
    }



}