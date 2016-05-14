
import {Module} from "./module";
import {GridsterItem} from "../libs/gridster/gridster";
import {DataProviderService} from "../services/data-provider.service";
import {Component} from "@angular/core"

@Component({
    selector: 'health-module',
    templateUrl: './app/modules/health-module.html'
})
export class HealthModule extends GridsterItem implements Module {
    readOnly:boolean = true;

    getModuleMetadata() {
        return null;
    }

    private _minThreshold: number;
    private _maxThreshold: number;
    private _currentValue: number;

    private _topText: string;
    private _bottomText: string;
    private _colors: any;

    constructor(private dataProviderService: DataProviderService) {
        super();
        // fake data
        this._minThreshold = 25;
        this._maxThreshold = 75;
        this._currentValue = 80;

        this._topText = 'This is a top text';
        this._bottomText = `${this._currentValue}`;
        this._colors = {
            top: 'inherit',
            bottom: 'inherit'
        };
    }

    getModuleClass() {
        let typeClasses = {
            'low': 'fa-minus',
            'high': 'fa-plus',
            'default': 'fa-circle'
        };
        if (this._currentValue < this._minThreshold) {
            return `${typeClasses.low} low`;
        } else if (this._currentValue < this._maxThreshold) {
            return `${typeClasses.default}`;
        } else {
            return `${typeClasses.high} high`;
        }
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
}