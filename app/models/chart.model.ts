import { Series } from './series.model'

export class Chart {
    private _labels: string[];
    private _series: Series[];

    constructor(labels:string[], series:Series[]) {
        this._labels = labels;
        this._series = series;
    }

    get labels():string[] {
        return this._labels;
    }

    set labels(value:Array) {
        this._labels = value;
    }

    get series():Series[] {
        return this._series;
    }

    set series(value:Array) {
        this._series = value;
    }
}