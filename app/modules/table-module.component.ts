import {GridsterItem} from "../libs/gridster/gridster";
import {Component} from "@angular/core";
import {Chart} from "../models/chart.model";
import {TableModuleMetadata} from "./table-module-metadata.model";
import {Module} from "./module";
import {DataProviderService} from "../services/data-provider.service";

@Component({
    selector: 'table-module',
    templateUrl: './app/modules/table-module.html'
})
export class TableModule extends GridsterItem implements Module {

    private _data: Chart;
    // style properties (move somewhere else ?)
    private _striped: boolean;
    private _condensed: boolean;

    private _showSeriesTitle: boolean;

    readOnly:boolean;

    constructor(private dataProviderService: DataProviderService) {
        super();
        this.randomizeData();
        setInterval(() => this.randomizeData(), 5000);
        this._striped = true;
        this._condensed = true;
        this._showSeriesTitle = true;
    }

    getModuleMetadata() {
        return new TableModuleMetadata();
    }

    private randomizeData() {
        this.dataProviderService.getBasicChartFromRandomData(4, 4).then(
            (chart: Chart) => this.data = chart
        );
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
}
