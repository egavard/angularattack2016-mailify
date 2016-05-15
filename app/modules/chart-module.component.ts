import {Component, ViewChild, AfterViewInit, Input} from '@angular/core';
import {DataProviderService} from "../services/data-provider.service";
import {BaseChartComponent, CHART_DIRECTIVES} from "../libs/ng2-charts-upgrade-rc1/components/charts/charts";
import {Chart} from "../models/chart.model";
import {ColorPickerDirective} from "../libs/color-picker/color-picker.directive";
import {Module} from "./module";
import { MODAL_DIRECTIVES } from 'ng2-bs3-modal/ng2-bs3-modal';
import {ChartModuleMetadata} from "./chart-module-metadata.model";
import {ChartPositionInformation} from './chart-position-information';
import {log} from '../decorators/log.decorator';

@Component({
    selector: 'chart-module',
    templateUrl: './app/modules/chart-module.html',
    directives:[CHART_DIRECTIVES, ColorPickerDirective, MODAL_DIRECTIVES]
})
export class ChartModule implements Module {
    @Input() readOnly:boolean;
    @ViewChild(BaseChartComponent) chart:BaseChartComponent;
    private _chartPositionInformation:ChartPositionInformation

    private backgroundColor: string = "rgba(255,107,13,1)";
    private borderColor: string = "rgba(232,65,12,1)";
    private pointBackgroundColor: string = "rgba(255,25,0,1)";

    private lineChartData:Array<any> = [];
    private lineChartLabels:Array<any> = [];
    private lineChartSeries:Array<any> = [];
    private lineChartOptions:any = {
        animation: false,
        responsive: true,
        multiTooltipTemplate: '<%if (datasetLabel){%><%=datasetLabel %>: <%}%><%= value %>'
    };
    private lineChartColours:Array<any> = [
        { // red
            backgroundColor: this.backgroundColor,
            borderColor: this.borderColor,
            pointBackgroundColor: this.pointBackgroundColor,
        },
        { // green
            backgroundColor: "rgba(0,204,13,1)",
            borderColor: "rgba(38,127,44,1)",
            pointBackgroundColor: "rgba(0,255,16,1)"
        },
        { // i'm blue
            backgroundColor: "rgba(76,118,255,1)",
            borderColor: "rgba(63,58,232,1)",
            pointBackgroundColor: "rgba(58,145,232,1)",
        }

    ];
    @Input() lineChartType:string = 'line';
    private sourceUrl1: string = '';

    ngAfterViewInit(){
        // this.chart.chartType='line';
    }

    @log()
    constructor(private dataProviderService: DataProviderService){
        this.readOnly = true;
        this.series = new Array<Serie>();

        this.randomizeData();
        this._chartPositionInformation = new ChartPositionInformation(0,0,1,1);
    }

    getModuleMetadata() {
        return null;
    }



    /**
     * Edition mode
     */

    @ViewChild('modal')
    modal: ModalComponent;

    edit() {
        var i = 0
        for (var item in this.lineChartSeries ) {
           var itemToAdd = {
                id: i,
                name: "Serie " + item
            };
            this.series.push(itemToAdd)
        i++;
        }
        this.selectedSerie = this.series[0]
        this.backgroundColor = this.chart.colours[this.selectedSerie.id].backgroundColor
        this.borderColor = this.chart.colours[this.selectedSerie.id].borderColor
        this.pointBackgroundColor = this.chart.colours[this.selectedSerie.id].pointBackgroundColor
        this.modal.open()
    }

    backgroundColorChanged(color){
        if (this.selectedSerie != null) {
            this.chart.colours[this.selectedSerie.id].backgroundColor = color;
            this.chart.refresh();
        }
    }
    borderColorChanged(color){
    if (this.selectedSerie != null) {
            this.chart.colours[this.selectedSerie.id].borderColor = color;
            this.chart.refresh();
        }
    }
   
    pointBackgroundColorChanged(color){
        if (this.selectedSerie != null) {
            this.chart.colours[this.selectedSerie.id].pointBackgroundColor = color;
            this.chart.refresh();
        }
    }

    public series: Serie[];
    public selectedSerie=null;
    onSelect(serieId) {
        this.selectedSerie = null;
        for (var i = 0; i < this.series.length; i++)
        {
            if (this.series[i].id == serieId) {
                this.selectedSerie = this.series[i];
                this.backgroundColor = this.chart.colours[this.selectedSerie.id].backgroundColor
                this.borderColor = this.chart.colours[this.selectedSerie.id].borderColor
                this.pointBackgroundColor = this.chart.colours[this.selectedSerie.id].pointBackgroundColor
            }
        }
    }

    public types: Serie[] = [
        { "id": 1, "name": "line" },
        { "id": 2, "name": "bar" },
        { "id": 3, "name": "radar" }
    ];
    public selectedType: Serie = this.types[0];
    onSelectType(typeId) {
        this.selectedType = null;
        for (var i = 0; i < this.types.length; i++)
        {
            if (this.types[i].id == typeId) {
                this.selectedType = this.types[i];
                this.chart.chartType=this.selectedType.name;
                this.chart.refresh();
            }
        }
    }

    /**
     * re-generates random data
     */
    randomizeData() {
        this.dataProviderService.getBasicChartFromRandomData(10, 3).then(
            (chart: Chart) => this.loadDataIntoChart(chart)
        );
    }

    loadDataFromSourceUrl() {
        this.dataProviderService.getBasicChartFromSourceUrl(this.sourceUrl1).subscribe(
            (chart: Chart) => this.loadDataIntoChart(chart),
            error => console.log(error)
        );
    }
    @log()
    private loadDataIntoChart(chart: Chart) {
        this.lineChartLabels = chart.labels;
        this.lineChartSeries = chart.series.map(s => s.title);
        this.lineChartData = chart.series.map(s => s.points);
    }

    get chartPositionInformation():ChartPositionInformation {
        return this._chartPositionInformation;
    }

    set chartPositionInformation(value:ChartPositionInformation) {
        this._chartPositionInformation = value;
    }
}



export class Serie {
    id: number;
    name: string;
}
