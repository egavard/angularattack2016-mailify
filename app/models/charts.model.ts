import { Chart } from './chart.model'

export class Charts {
    private _labels: string[];
    private _charts: Chart[];

    constructor(labels:string[], charts:Chart[]) {
        this._labels = labels;
        this._charts = charts;
    }

    get labels():string[] {
        return this._labels;
    }

    set labels(value:Array) {
        this._labels = value;
    }

    get charts():Chart[] {
        return this._charts;
    }

    set charts(value:Array) {
        this._charts = value;
    }
}