import { ChartSeries } from './chart-series.model.ts'

export class Chart {
    private _labels: Array<string>;
    private _series: Array<ChartSeries>;

    constructor(labels:string[], series:ChartSeries[]) {
        this._labels = labels;
        this._series = series;
    }
    
    get labels():Array<string> {
        return this._labels;
    }

    set labels(value:Array<string>) {
        this._labels = value;
    }

    get series():Array<ChartSeries> {
        return this._series;
    }

    set series(value:Array<ChartSeries>) {
        this._series = value;
    }
}