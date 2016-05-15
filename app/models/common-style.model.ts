export class CommonStyle {

    private _color: string;
    // string 'cause it's just a css wrapper
    private _fontSize: string;
    private _fontWeight: string;

    public static COLOR_DEFAULT = 'inherit';

    constructor(color:string = CommonStyle.COLOR_DEFAULT, fontSize:string = 'inherit', fontWeight:string = 'normal') {
        this._color = color;
        this._fontSize = fontSize;
        this._fontWeight = fontWeight;
    }

    get color():string {
        return this._color;
    }

    set color(value: string) {
        this._color = value;
    }

    get fontSize():string {
        return this._fontSize;
    }

    set fontSize(value: string) {
        this._fontSize = value;
    }

    get fontWeight():string {
        return this._fontWeight;
    }

    set fontWeight(value: string) {
        this._fontWeight = value;
    }
}