"use strict";
var Charts = (function () {
    function Charts(labels, charts) {
        _labels = labels;
        _charts = charts;
    }
    Object.defineProperty(Charts.prototype, "labels", {
        get: function () {
            return this._labels;
        },
        set: function (value) {
            this._labels = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Charts.prototype, "charts", {
        get: function () {
            return this._charts;
        },
        set: function (value) {
            this._charts = value;
        },
        enumerable: true,
        configurable: true
    });
    return Charts;
}());
exports.Charts = Charts;
//# sourceMappingURL=charts.model.js.map