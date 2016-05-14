import {ModuleMetadata} from "./module-metadata.model";

export enum ChartType {
    LINE, BAR
}

export class ChartModuleMetadata implements ModuleMetadata {
    private _icon: string;
    private _name: string;
    private _type: ChartType;

    constructor(icon: string, name: string, chartType: ChartType) {
        this._icon = icon;
        this._name = name;
        this._type = chartType;
    }

    getIcon() {
        return this._icon;
    }

    getName() {
        return this._name;
    }

    getShartType(): ChartType {
        return this._type;
    }
}