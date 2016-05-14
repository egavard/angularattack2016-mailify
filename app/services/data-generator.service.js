"use strict";
/**
 * Simple dummy data generator to be injected into charts
 */
var DataGenerator = (function () {
    function DataGenerator() {
    }
    DataGenerator.prototype.generateDummyData = function (numberOfCategories, numberOfCharts, maxValue) {
        if (maxValue === void 0) { maxValue = 100; }
        var data = {};
        data.labels = [];
        data.charts = [];
        for (var _i = 0, numberOfCategories_1 = numberOfCategories; _i < numberOfCategories_1.length; _i++) {
            var i = numberOfCategories_1[_i];
            data.labels.push('Label ${i}');
        }
        for (var _a = 0, numberOfCharts_1 = numberOfCharts; _a < numberOfCharts_1.length; _a++) {
            var j = numberOfCharts_1[_a];
            var values = [];
            for (var _b = 0, numberOfCategories_2 = numberOfCategories; _b < numberOfCategories_2.length; _b++) {
                var k = numberOfCategories_2[_b];
                values.push(this.getRandomInt(0, maxValue));
            }
            data.charts.push({
                title: 'Series ${j}',
                values: values
            });
        }
        // simulate raw JSON string from remote call
        return JSON.stringify(data);
    };
    /**
     * Returns a random integer between min (inclusive) and max (inclusive)
     * Using Math.round() will give you a non-uniform distribution!
     */
    DataGenerator.prototype.getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    return DataGenerator;
}());
exports.DataGenerator = DataGenerator;
//# sourceMappingURL=data-generator.service.js.map