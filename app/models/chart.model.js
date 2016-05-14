"use strict";
var Chart = (function () {
    function Chart(title, points) {
        _title = title;
        _points = points;
    }
    Object.defineProperty(Chart.prototype, "title", {
        get: function () {
            return this._title;
        },
        set: function (value) {
            this._title = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Chart.prototype, "points", {
        get: function () {
            return this._points;
        },
        set: function (value) {
            this._points = value;
        },
        enumerable: true,
        configurable: true
    });
    return Chart;
}());
exports.Chart = Chart;
//# sourceMappingURL=chart.model.js.map