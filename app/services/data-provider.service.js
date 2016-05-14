"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var data_generator_service_1 = require('./data-generator.service');
/*
 {
     "labels": ["Group 1", "Goup N"],
     "charts": [{
         "title": "Product",
         "values": [1, 2, 3]
         }, {
         "title": "Product",
         "values": [1, 2, 3]
     }]
 }
*/
// Quick & dirty !
var DataProviderService = (function () {
    function DataProviderService(dataGenerator) {
        this.dataGenerator = dataGenerator;
    }
    DataProviderService.prototype.getBasicChart = function (numberOfCategories, numberOfSeries) {
        if (numberOfCategories === void 0) { numberOfCategories = 8; }
        if (numberOfSeries === void 0) { numberOfSeries = 2; }
        return this.dataGenerator.generateDummyData(numberOfCategories, numberOfSeries);
    };
    DataProviderService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [data_generator_service_1.DataGenerator])
    ], DataProviderService);
    return DataProviderService;
}());
exports.DataProviderService = DataProviderService;
//# sourceMappingURL=data-provider.service.js.map