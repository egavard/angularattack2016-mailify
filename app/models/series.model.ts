export class Series {
    private _title: string;
    private _points: number[];

    constructor(title:string, points:number[]) {
        this._title = title;
        this._points = points;
    }

    get title():string {
        return this._title;
    }

    set title(value:string) {
        this._title = value;
    }

    get points():number[] {
        return this._points;
    }

    set points(value:Array) {
        this._points = value;
    }
}