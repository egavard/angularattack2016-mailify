export class Series {
    private _title: string;
    private _points: Array<number>;

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

    get points():Array<number> {
        return this._points;
    }

    set points(value:Array<number>) {
        this._points = value;
    }
}