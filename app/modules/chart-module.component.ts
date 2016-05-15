import {Component, ViewChild, Input, Optional} from '@angular/core';
import {COMMON_DIRECTIVES} from '@angular/common';
import {DataProviderService} from '../services/data-provider.service';
import {BaseChartComponent, CHART_DIRECTIVES} from '../libs/ng2-charts-upgrade-rc1/components/charts/charts';
import {Chart} from '../models/chart.model';
import {ColorPickerDirective} from '../libs/color-picker/color-picker.directive';
import {Module} from './module';
import {MODAL_DIRECTIVES, ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';
import {ChartPositionInformation} from './chart-position-information';
import {CommonStyle} from '../models/common-style.model';

@Component({
    selector: 'chart-module',
    templateUrl: './app/modules/chart-module.html',
    directives: [CHART_DIRECTIVES, ColorPickerDirective, MODAL_DIRECTIVES, COMMON_DIRECTIVES]
})
export class ChartModule implements Module {
    @Input() private _readOnly:boolean = false;
    @Input() private _id:string = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    @Input() private _dataPrepared:boolean = false;
    @ViewChild(BaseChartComponent) private _chart:BaseChartComponent;
    @Input() private _chartPositionInformation:ChartPositionInformation

    @Input() private _backgroundColor:string = "rgba(222, 239, 183, 0.6)";
    @Input() private _borderColor:string = "rgba(222, 239, 183, 1)";
    @Input() private _pointBackgroundColor:string = "rgba(222, 239, 183, 1)";

    @Input() private _lineChartData:Array<any> = [];
    @Input() private _lineChartLabels:Array<any> = [];
    @Input() private _lineChartSeries:Array<any> = [];
    @Input() private _lineChartOptions:any = {
        animation: false,
        responsive: true,
        elements: {
            line: {
                borderWidth: 10
            }
        },
        multiTooltipTemplate: '<%if (datasetLabel){%><%=datasetLabel %>: <%}%><%= value %>'
    };
    @Input() private _lineChartColours:Array<any> = [
        { // red
            backgroundColor: this._backgroundColor,
            borderColor: this._borderColor,
            pointBackgroundColor: this._pointBackgroundColor,
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
    @Input() private _lineChartType:string = 'line';
    @Input() private _sourceUrl1:string = '';
    @ViewChild('_modal') private _modal:ModalComponent;
    @Input() private _series:Serie[];
    @Input() private _selectedSerie = null;


    /**
     * HEALTH MODULE
     */
    @Input()private _minThreshold: number;
    @Input()private _maxThreshold: number;
    @Input()private _currentValue: number;

    @Input()private _topText: string;
    @Input()private _bottomText: string;

    // styles
    private _topStyle:CommonStyle;
    private _mainStyle:CommonStyle;
    private _bottomStyle:CommonStyle;

    @Input()private _moduleData:any = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum eros in nunc varius dapibus. Aliquam vel aliquam ante. Vivamus euismod tortor vel tincidunt gravida. Etiam enim velit, consectetur non eleifend in, lobortis sed quam. Vivamus imperdiet odio efficitur leo ultricies ullamcorper. Quisque congue elit in est lobortis, eget accumsan eros rhoncus. Cras congue quam et arcu scelerisque, ut hendrerit turpis ultrices. Praesent quis magna nec massa lacinia porttitor. Proin tristique, ipsum quis varius aliquam, justo nunc molestie sem, quis tristique leo magna at leo. Nullam dapibus efficitur auctor."

    @Input()private _data: Chart;
    // style properties (move somewhere else ?)
    @Input()private _striped: boolean;
    @Input()private _condensed: boolean;

    @Input()private _showSeriesTitle: boolean;

    @Input()private _innerType:string;


    constructor(private dataProviderService:DataProviderService, @Optional() innerModuleType?:string) {
        if(innerModuleType){
            this.innerType = innerModuleType;
        }
        if(this.innerType){
            if('ChartModule' == this.innerType){
                this._series = [];
                this._chartPositionInformation = new ChartPositionInformation(0, 0, 1, 1);
                this.randomizeData();
                setInterval(() => this.randomizeData(), 5000);

            }else if('HealthModule' == this.innerType){
                // fake data
                this._minThreshold = 25;
                this._maxThreshold = 75;

                this._topText = `This is an health indicator.
            Low when < ${this._minThreshold}, 
            High when > ${this._maxThreshold} 
        `;
                this._topStyle = new CommonStyle(CommonStyle.COLOR_DEFAULT, 'inherit', 'bold');
                this._mainStyle = new CommonStyle();
                this._bottomStyle = new CommonStyle('inherit', '2em', 'bold');
                setInterval(() => this.randomize(), 5000);
                this.randomize();
            }else if('TableModule' == this.innerType){
                this.randomizeData();
                setInterval(() => this.randomizeTableData(), 5000);
                this._striped = true;
                this._condensed = true;
                this._showSeriesTitle = true;

            }
        }else{
            this._series = [];
            this._chartPositionInformation = new ChartPositionInformation(0, 0, 1, 1);
            this.randomizeData();
            setInterval(() => this.randomizeData(), 5000);

        }
    }

    getModuleMetadata() {
        return null;
    }

    /**
     * Edition mode
     */
    edit() {
        var i = 0;
        this._series = new Array<Serie>();
        for (var item in this._lineChartSeries) {
            var itemToAdd = {
                id: i,
                name: `Serie ${item}`
            };
            this._series.push(itemToAdd);
            i++;
        }
        this._selectedSerie = this._series[0];
        this._backgroundColor = this._chart.colours[this._selectedSerie.id]._backgroundColor;
        this._borderColor = this._chart.colours[this._selectedSerie.id]._borderColor;
        this._pointBackgroundColor = this._chart.colours[this._selectedSerie.id]._pointBackgroundColor;
        this._modal.open();
    }

    backgroundColorChanged(color) {
        if (this._selectedSerie != null) {
            this._chart.colours[this._selectedSerie.id].backgroundColor = color;
            this._chart.refresh();
        }
    }

    borderColorChanged(color) {
        if (this._selectedSerie != null) {
            this._chart.colours[this._selectedSerie.id].borderColor = color;
            this._chart.refresh();
        }
    }

    pointBackgroundColorChanged(color) {
        if (this._selectedSerie != null) {
            this._chart.colours[this._selectedSerie.id].pointBackgroundColor = color;
            this._chart.refresh();
        }
    }

    onSelect(serieId) {
        this._selectedSerie = null;
        for (var i = 0; i < this._series.length; i++) {
            if (this._series[i].id == serieId) {
                this._selectedSerie = this._series[i];
                this._backgroundColor = this._chart.colours[this._selectedSerie.id]._backgroundColor;
                this._borderColor = this._chart.colours[this._selectedSerie.id]._borderColor;
                this._pointBackgroundColor = this._chart.colours[this._selectedSerie.id]._pointBackgroundColor;
            }
        }
    }


    /**
     * re-generates random data
     */


    loadDataFromSourceUrl() {
        this.dataProviderService.getBasicChartFromSourceUrl(this._sourceUrl1).subscribe(
            (chart:Chart) => this.loadDataIntoChart(chart),
            error => console.log(error)
        );
    }

    private loadDataIntoChart(chart:Chart) {
        this._lineChartLabels = chart.labels;
        this._lineChartSeries = chart.series.map(s => s.title);
        this._lineChartData = chart.series.map(s => s.points);
        this._dataPrepared = true;
    }


    getModuleClass() {
        let typeClasses = {
            'low': 'fa-arrow-circle-down',
            'high': 'fa-arrow-circle-up',
            'default': 'fa-minus-square'
        };
        if (this._currentValue < this._minThreshold) {
            return `${typeClasses.low} low`;
        } else if (this._currentValue < this._maxThreshold) {
            return `${typeClasses.default}`;
        } else {
            return `${typeClasses.high} high`;
        }
    }

    private randomize() {
        this._currentValue = Math.round(Math.random() * 100);
        this._bottomText = `Current value: ${this._currentValue}`;
    }

    randomizeData() {
        this.dataProviderService.getBasicChartFromRandomData(5, 3).then(
            (chart:Chart) => this.loadDataIntoChart(chart)
        );
    }

    private randomizeTableData() {
        this.dataProviderService.getBasicChartFromRandomData(4, 4).then(
            (chart: Chart) => this.data = chart
        );
    }


    get readOnly():boolean {
        return this._readOnly;
    }

    set readOnly(value:boolean) {
        this._readOnly = value;
    }

    get id():string {
        return this._id;
    }

    set id(value:string) {
        this._id = value;
    }

    get dataPrepared():boolean {
        return this._dataPrepared;
    }

    set dataPrepared(value:boolean) {
        this._dataPrepared = value;
    }

    get chart():BaseChartComponent {
        return this._chart;
    }

    set chart(value:BaseChartComponent) {
        this._chart = value;
    }

    get chartPositionInformation():ChartPositionInformation {
        return this._chartPositionInformation;
    }

    set chartPositionInformation(value:ChartPositionInformation) {
        this._chartPositionInformation = value;
    }

    get backgroundColor():string {
        return this._backgroundColor;
    }

    set backgroundColor(value:string) {
        this._backgroundColor = value;
    }

    get borderColor():string {
        return this._borderColor;
    }

    set borderColor(value:string) {
        this._borderColor = value;
    }

    get pointBackgroundColor():string {
        return this._pointBackgroundColor;
    }

    set pointBackgroundColor(value:string) {
        this._pointBackgroundColor = value;
    }

    get lineChartData():Array<any> {
        return this._lineChartData;
    }

    set lineChartData(value:Array<any>) {
        this._lineChartData = value;
    }

    get lineChartLabels():Array<any> {
        return this._lineChartLabels;
    }

    set lineChartLabels(value:Array<any>) {
        this._lineChartLabels = value;
    }

    get lineChartSeries():Array<any> {
        return this._lineChartSeries;
    }

    set lineChartSeries(value:Array<any>) {
        this._lineChartSeries = value;
    }

    get lineChartOptions():any {
        return this._lineChartOptions;
    }

    set lineChartOptions(value:any) {
        this._lineChartOptions = value;
    }

    get lineChartColours():Array<any> {
        return this._lineChartColours;
    }

    set lineChartColours(value:Array<any>) {
        this._lineChartColours = value;
    }

    get lineChartType():string {
        return this._lineChartType;
    }

    set lineChartType(value:string) {
        this._lineChartType = value;
    }

    get sourceUrl1():string {
        return this._sourceUrl1;
    }

    set sourceUrl1(value:string) {
        this._sourceUrl1 = value;
    }

    get modal():ModalComponent {
        return this._modal;
    }

    set modal(value:ModalComponent) {
        this._modal = value;
    }

    get series():Serie[] {
        return this._series;
    }

    set series(value:Array) {
        this._series = value;
    }

    get selectedSerie():any {
        return this._selectedSerie;
    }

    set selectedSerie(value:any) {
        this._selectedSerie = value;
    }

    get minThreshold():number {
        return this._minThreshold;
    }

    set minThreshold(value:number) {
        this._minThreshold = value;
    }

    get maxThreshold():number {
        return this._maxThreshold;
    }

    set maxThreshold(value:number) {
        this._maxThreshold = value;
    }

    get currentValue():number {
        return this._currentValue;
    }

    set currentValue(value:number) {
        this._currentValue = value;
    }

    get topText():string {
        return this._topText;
    }

    set topText(value:string) {
        this._topText = value;
    }

    get bottomText():string {
        return this._bottomText;
    }

    set bottomText(value:string) {
        this._bottomText = value;
    }

    get topStyle():CommonStyle {
        return this._topStyle;
    }

    set topStyle(value:CommonStyle) {
        this._topStyle = value;
    }

    get mainStyle():CommonStyle {
        return this._mainStyle;
    }

    set mainStyle(value:CommonStyle) {
        this._mainStyle = value;
    }

    get bottomStyle():CommonStyle {
        return this._bottomStyle;
    }

    set bottomStyle(value:CommonStyle) {
        this._bottomStyle = value;
    }

    get moduleData():any {
        return this._moduleData;
    }

    set moduleData(value:any) {
        this._moduleData = value;
    }

    get data():Chart {
        return this._data;
    }

    set data(value:Chart) {
        this._data = value;
    }

    get striped():boolean {
        return this._striped;
    }

    set striped(value:boolean) {
        this._striped = value;
    }

    get condensed():boolean {
        return this._condensed;
    }

    set condensed(value:boolean) {
        this._condensed = value;
    }

    get showSeriesTitle():boolean {
        return this._showSeriesTitle;
    }

    set showSeriesTitle(value:boolean) {
        this._showSeriesTitle = value;
    }

    get innerType():string {
        return this._innerType;
    }

    set innerType(value:string) {
        this._innerType = value;
    }
}

export class Serie {
    id:number;
    name:string;
}
