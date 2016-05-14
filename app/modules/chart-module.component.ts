import {Component, ViewChild, AfterViewInit, Input} from '@angular/core';
import {DataProviderService} from "../services/data-provider.service";
import {BaseChartComponent, CHART_DIRECTIVES} from "../libs/ng2-charts-upgrade-rc1/components/charts/charts";
import {Chart} from "../models/chart.model";
import {ColorPickerDirective} from "../libs/color-picker/color-picker.directive";
import {Module} from "./module";
import {ChartModuleMetadata} from "./chart-module-metadata.model";

@Component({
    selector: 'chart-module',
    templateUrl: './app/modules/chart-module.html',
    directives:[CHART_DIRECTIVES, ColorPickerDirective]
})
export class ChartModule implements Module {
    @Input() readOnly:boolean;

    @ViewChild(BaseChartComponent) chart:BaseChartComponent;

    private fillColor1: string = "rgba(242,56,217,0.6)";
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
    @Input() lineChartType:string = 'line';
    private sourceUrl1: string = '';

    ngAfterViewInit(){
        // this.chart.chartType='line';
    }

    constructor(private dataProviderService: DataProviderService){
        this.readOnly = true;
        this.randomizeData();
    }

    getModuleMetadata() {
        return null;
    }

    edit() {
        console.log("bak");
    }

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
        this.dataProviderService.getBasicChartFromRandomData(10, 4).then(
            (chart: Chart) => this.loadDataIntoChart(chart)
        );
    }

    loadDataFromSourceUrl() {
        this.dataProviderService.getBasicChartFromSourceUrl(this.sourceUrl1).subscribe(
            (chart: Chart) => this.loadDataIntoChart(chart),
            error => console.log(error)
        );
    }

    private loadDataIntoChart(chart: Chart) {
        this.lineChartLabels = chart.labels;
        this.lineChartSeries = chart.series.map(s => s.title);
        this.lineChartData = chart.series.map(s => s.points);
    }
}