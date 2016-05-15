import {Component, ViewChild, AfterViewInit, Input} from '@angular/core';
import {DataProviderService} from "../services/data-provider.service";
import {BaseChartComponent, CHART_DIRECTIVES} from "../libs/ng2-charts-upgrade-rc1/components/charts/charts";
import {Chart} from "../models/chart.model";
import {ColorPickerDirective} from "../libs/color-picker/color-picker.directive";
import {Module} from "./module";
import {MODAL_DIRECTIVES, ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';
import {ChartModuleMetadata} from "./chart-module-metadata.model";
import {ChartPositionInformation} from './chart-position-information';
import {log} from '../decorators/log.decorator';

@Component({
    selector: 'chart-module',
    templateUrl: './app/modules/chart-module.html',
    directives: [CHART_DIRECTIVES, ColorPickerDirective, MODAL_DIRECTIVES]
})
export class ChartModule implements Module {
    @Input() private _readOnly:boolean = false;
    @Input() private id:string = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    @Input() private dataPrepared:boolean = false;
    @ViewChild(BaseChartComponent) chart:BaseChartComponent;
    @Input() private _chartPositionInformation:ChartPositionInformation

    @Input() private backgroundColor:string = "rgba(222, 239, 183, 0.6)";
    @Input() private borderColor:string = "rgba(222, 239, 183, 1)";
    @Input() private pointBackgroundColor:string = "rgba(222, 239, 183, 1)";

    @Input() private lineChartData:Array<any> = [];
    @Input() private lineChartLabels:Array<any> = [];
    @Input() private lineChartSeries:Array<any> = [];
    @Input() private lineChartOptions:any = {
        animation: false,
        responsive: true,
        elements: {
            line: {
                borderWidth: 10
            }
        },
        multiTooltipTemplate: '<%if (datasetLabel){%><%=datasetLabel %>: <%}%><%= value %>'
    };
    @Input() private lineChartColours:Array<any> = [
        { // red
            backgroundColor: this.backgroundColor,
            borderColor: this.borderColor,
            pointBackgroundColor: this.pointBackgroundColor,
        },
        { // green
            backgroundColor: "rgba(0, 204, 13, 0.6)",
            borderColor: "rgba(38, 127, 44, 1)",
            pointBackgroundColor: "rgba(0, 255, 16, 1)"
        },
        { // i'm blue
            backgroundColor: "rgba(76, 118, 255, 0.6)",
            borderColor: "rgba(63, 58, 232, 1)",
            pointBackgroundColor: "rgba(58, 145, 232, 1)",
        }

    ];
    @Input() lineChartType:string = 'line';
    @Input() private sourceUrl1:string = '';
    @ViewChild('modal') modal:ModalComponent;
    @Input() public series:Serie[];
    @Input() public selectedSerie = null;

    constructor(private dataProviderService:DataProviderService) {
        this.series = [];
        this._chartPositionInformation = new ChartPositionInformation(0, 0, 1, 1);
        this.randomizeData()
        setInterval(() => this.randomizeData(), 5000);
    }

    getModuleMetadata() {
        return null;
    }

    /**
     * Edition mode
     */
    edit() {
        var i = 0;
        this.series = new Array<Serie>();
        for (var item in this.lineChartSeries) {
            var itemToAdd = {
                id: i,
                name: `Serie ${item}`
            };
            this.series.push(itemToAdd);
            i++;
        }
        this.selectedSerie = this.series[0];
        this.backgroundColor = this.chart.colours[this.selectedSerie.id].backgroundColor;
        this.borderColor = this.chart.colours[this.selectedSerie.id].borderColor;
        this.pointBackgroundColor = this.chart.colours[this.selectedSerie.id].pointBackgroundColor;
        this.modal.open();
    }

    backgroundColorChanged(color) {
        if (this.selectedSerie != null) {
            this.chart.colours[this.selectedSerie.id].backgroundColor = color;
            this.chart.refresh();
        }
    }

    borderColorChanged(color) {
        if (this.selectedSerie != null) {
            this.chart.colours[this.selectedSerie.id].borderColor = color;
            this.chart.refresh();
        }
    }

    pointBackgroundColorChanged(color) {
        if (this.selectedSerie != null) {
            this.chart.colours[this.selectedSerie.id].pointBackgroundColor = color;
            this.chart.refresh();
        }
    }

    onSelect(serieId) {
        this.selectedSerie = null;
        for (var i = 0; i < this.series.length; i++) {
            if (this.series[i].id == serieId) {
                this.selectedSerie = this.series[i];
                this.backgroundColor = this.chart.colours[this.selectedSerie.id].backgroundColor;
                this.borderColor = this.chart.colours[this.selectedSerie.id].borderColor;
                this.pointBackgroundColor = this.chart.colours[this.selectedSerie.id].pointBackgroundColor;
            }
        }
    }


    /**
     * re-generates random data
     */
    randomizeData() {
        this.dataProviderService.getBasicChartFromRandomData(5, 3).then(
            (chart:Chart) => this.loadDataIntoChart(chart)
        );
    }

    loadDataFromSourceUrl() {
        this.dataProviderService.getBasicChartFromSourceUrl(this.sourceUrl1).subscribe(
            (chart:Chart) => this.loadDataIntoChart(chart),
            error => console.log(error)
        );
    }

    private loadDataIntoChart(chart:Chart) {
        this.lineChartLabels = chart.labels;
        this.lineChartSeries = chart.series.map(s => s.title);
        this.lineChartData = chart.series.map(s => s.points);
        this.dataPrepared = true;
    }

    get chartPositionInformation():ChartPositionInformation {
        return this._chartPositionInformation;
    }

    set chartPositionInformation(value:ChartPositionInformation) {
        this._chartPositionInformation = value;
    }


    get readOnly():boolean {
        return this._readOnly;
    }

    set readOnly(value:boolean) {
        this._readOnly = value;
    }
}

export class Serie {
    id:number;
    name:string;
}
