import { Component, ViewChild, AfterViewInit } from '@angular/core';
import {Gridster} from "../../libs/gridster/gridster.component";
import {CHART_DIRECTIVES, BaseChartComponent} from "../../libs/ng2-charts-upgrade-rc1/components/charts/charts";
import {ColorPickerDirective} from "../../libs/color-picker/color-picker.directive";
import {DebugModule} from "../../modules/debug-module.component";
import {DataProviderService} from "../../services/data-provider.service";
import {Chart} from "../../models/chart.model";


@Component({
    selector: 'home',
    templateUrl: './app/dashboard/home/home.html',
    directives:[Gridster, CHART_DIRECTIVES, ColorPickerDirective]
})
export class HomeComponent implements AfterViewInit {
    @ViewChild(Gridster) gridster:Gridster;
    @ViewChild(BaseChartComponent) chart:BaseChartComponent;

    private fillColor1: string = "rgba(249,0,198,1)";
    private strokeColor1: string;
    private pointColor1: string;
    private pointStrokeColor1: string;
    private pointHighlightFill1: string;
    private pointHighlightStroke1: string;


    private lineChartData:Array<any> = [];
    private lineChartLabels:Array<any> = [];
    private lineChartSeries:Array<any> = [];
    private lineChartOptions:any = {
        animation: false,
        responsive: true,
        multiTooltipTemplate: '<%if (datasetLabel){%><%=datasetLabel %>: <%}%><%= value %>'
    };
    private lineChartColours:Array<any> = [
        { // grey
            backgroundColor: this.fillColor1,
            borderColor: 'rgba(249,0,198,1)',
            pointColor: 'rgba(249,0,198,1)',
            pointBackgroundColor: '#000',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(148,159,177,0.8)'
        },

    ];
    private lineChartLegend:boolean = true;
    private lineChartType:string = 'line';
    private color: string = "#127bdc";

    ngAfterViewInit(){
        let debugModule:DebugModule = new DebugModule(this.gridster);
        debugModule.sizeX = 2;
        debugModule.sizeY = 1;
        debugModule.row = 0;
        debugModule.col = 0;
        this.gridster.putItem(debugModule);
    }

    constructor(private dataProviderService: DataProviderService){
        this.randomizeData();
    }

    // events
    chartClicked(e:any) {
        console.log(e);
    }

    chartHovered(e:any) {
        console.log(e);
    }

    functionwhencolorchange(color){
        this.chart.colours[0].backgroundColor = color;
        this.chart.colours[0].borderColor = color;

        this.chart.refresh();
    }

    /**
     * re-generates random data
     */
    randomizeData() {
        this.dataProviderService.getBasicChart(10, 4).then((chart: Chart) => {
            this.lineChartLabels = chart.labels;
            this.lineChartSeries = chart.series.map(s => s.title);
            this.lineChartData = chart.series.map(s => s.points);
        });
    }
}