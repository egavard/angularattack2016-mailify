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
    @Input() readOnly:boolean;
    @Input() private id:string = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    @Input() private dataPrepared:boolean = false;
    @ViewChild(BaseChartComponent) chart:BaseChartComponent;
    @Input() private _chartPositionInformation:ChartPositionInformation;

    // edition mode placeholders
    @Input() private backgroundColor:string;
    @Input() private borderColor:string;
    @Input() private pointBackgroundColor:string;
    @Input() private selectedSeries = null;

    // data placeholders
    @Input() series:string[];
    @Input() data:number[][];
    @Input() labels:string[];

    @Input() chartOptions:any = {
        animation: false,
        responsive: true,
        elements: {
            line: {
                borderWidth: 1
            }
        },
        multiTooltipTemplate: '<%if (datasetLabel){%><%=datasetLabel %>: <%}%><%= value %>'
    };
    @Input() chartColors:Array<SeriesColors> = [
        new SeriesColors("rgba(222, 239, 183, 0.6)",
            "rgba(222, 239, 183, 1)",
            "rgba(222, 239, 183, 1)")
        ,
        new SeriesColors(
            "rgba(0, 204, 13, 0.6)",
            "rgba(38, 127, 44, 1)",
            "rgba(0, 255, 16, 1)"
        ),
        new SeriesColors(
            "rgba(76, 118, 255, 0.6)",
            "rgba(63, 58, 232, 1)",
            "rgba(58, 145, 232, 1)"
        )

    ];
    @Input() private sourceUrl:string = '';
    @Input() chartType:string = 'line';
    @ViewChild('modal') modal:ModalComponent;

    constructor(private dataProviderService:DataProviderService) {
        this.readOnly = true;
        this.series = [];
        this._chartPositionInformation = new ChartPositionInformation(0, 0, 1, 1);
        this.randomizeData();
        //setInterval(() => this.randomizeData(), 5000);
    }

    getModuleMetadata() {
        return null;
    }

    getConfig() {
        console.log(this.chart);
        return {
            type: this.chart.chartType,
            colors: this.chart.colours
        };
    }

    get chartPositionInformation():ChartPositionInformation {
        return this._chartPositionInformation;
    }

    set chartPositionInformation(value:ChartPositionInformation) {
        this._chartPositionInformation = value;
    }

    /**
     * Edition mode
     */
    edit() {
        this.selectedSeries = this.series[0];
        this.backgroundColor = this.chart.colours[this.series.indexOf(this.selectedSeries)].backgroundColor;
        this.borderColor = this.chart.colours[this.series.indexOf(this.selectedSeries)].borderColor;
        this.pointBackgroundColor = this.chart.colours[this.series.indexOf(this.selectedSeries)].pointBackgroundColor;
        this.modal.open();
    }

    backgroundColorChanged(color) {
        if (this.selectedSeries != null) {
            this.chart.colours[this.series.indexOf(this.selectedSeries)].backgroundColor = color;
            this.chart.refresh();
        }
    }

    borderColorChanged(color) {
        if (this.selectedSeries != null) {
            this.chart.colours[this.series.indexOf(this.selectedSeries)].borderColor = color;
            this.chart.refresh();
        }
    }

    pointBackgroundColorChanged(color) {
        if (this.selectedSeries != null) {
            this.chart.colours[this.series.indexOf(this.selectedSeries)].pointBackgroundColor = color;
            this.chart.refresh();
        }
    }

    onSelect(serie) {
        let idx = this.series.indexOf(serie);
        if (idx > -1) {
            this.selectedSeries = serie;
            this.backgroundColor = this.chart.colours[idx].backgroundColor;
            this.borderColor = this.chart.colours[idx].borderColor;
            this.pointBackgroundColor = this.chart.colours[idx].pointBackgroundColor;
        } else {
            throw 'series not found';
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
        this.dataProviderService.getBasicChartFromSourceUrl(this.sourceUrl).subscribe(
            (chart:Chart) => this.loadDataIntoChart(chart),
            error => console.log(error)
        );
    }

    private loadDataIntoChart(chart:Chart) {
        this.labels = chart.labels;
        this.series = chart.series.map(s => s.title);
        this.data = chart.series.map(s => s.points);
        this.dataPrepared = true;
    }

}

export class SeriesColors {
    backgroundColor:string;
    borderColor:string;
    pointBackgroundColor:string;

    constructor(backgroundColor:string, borderColor:string, pointBackgroundColor:string) {
        this.backgroundColor = backgroundColor;
        this.borderColor = borderColor;
        this.pointBackgroundColor = pointBackgroundColor;
    }
}