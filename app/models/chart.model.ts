import { Series } from './series.model'

export class Chart {
    private _labels: Array<string>;
    private _series: Array<Series>;

    constructor(labels:string[], series:Series[]) {
        this._labels = labels;
        this._series = series;
    }


    get labels():Array<string> {
        return this._labels;
    }

    set labels(value:Array<string>) {
        this._labels = value;
    }

    get series():Array<Series> {
        return this._series;
    }

    set series(value:Array<Series>) {
        this._series = value;
    }
}