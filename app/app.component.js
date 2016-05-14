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
/**
 * Created by egavard on 14/05/16.
 */
var core_1 = require('@angular/core');
var gridster_component_1 = require('./libs/gridster/gridster.component');
var debug_module_component_1 = require('./modules/debug-module.component');
var data_provider_service_1 = require('./services/data-provider.service');
var ng2_charts_1 = require('./libs/ng2-charts-upgrade-rc1/ng2-charts');
var AppComponent = (function () {
    function AppComponent(dataProviderService) {
        this.dataProviderService = dataProviderService;
        // lineChart
        this.lineChartData = [
            [65, 59, 80, 81, 56, 55, 40],
            [28, 48, 40, 19, 86, 27, 90],
            [18, 48, 77, 9, 100, 27, 40]
        ];
        this.lineChartLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
        this.lineChartSeries = ['Series A', 'Series B', 'Series C'];
        this.lineChartOptions = {
            animation: false,
            responsive: true,
            multiTooltipTemplate: '<%if (datasetLabel){%><%=datasetLabel %>: <%}%><%= value %>'
        };
        this.lineChartColours = [
            {
                fillColor: 'rgba(148,159,177,0.2)',
                strokeColor: 'rgba(148,159,177,1)',
                pointColor: 'rgba(148,159,177,1)',
                pointStrokeColor: '#fff',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'rgba(148,159,177,0.8)'
            },
            {
                fillColor: 'rgba(77,83,96,0.2)',
                strokeColor: 'rgba(77,83,96,1)',
                pointColor: 'rgba(77,83,96,1)',
                pointStrokeColor: '#fff',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'rgba(77,83,96,1)'
            },
            {
                fillColor: 'rgba(148,159,177,0.2)',
                strokeColor: 'rgba(148,159,177,1)',
                pointColor: 'rgba(148,159,177,1)',
                pointStrokeColor: '#fff',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'rgba(148,159,177,0.8)'
            }
        ];
        this.lineChartLegend = true;
        this.lineChartType = 'radar';
        console.log(dataProviderService.getBasicChart());
    }
    AppComponent.prototype.ngAfterViewInit = function () {
        var debugModule = new debug_module_component_1.DebugModule(this.gridster);
        debugModule.sizeX = 2;
        debugModule.sizeY = 1;
        debugModule.row = 0;
        debugModule.col = 0;
        this.gridster.putItem(debugModule);
    };
    // events
    AppComponent.prototype.chartClicked = function (e) {
        console.log(e);
    };
    AppComponent.prototype.chartHovered = function (e) {
        console.log(e);
    };
    __decorate([
        core_1.ViewChild(gridster_component_1.Gridster), 
        __metadata('design:type', gridster_component_1.Gridster)
    ], AppComponent.prototype, "gridster", void 0);
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app',
            moduleId: module.id,
            templateUrl: './app.html',
            directives: [gridster_component_1.Gridster, ng2_charts_1.CHART_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [data_provider_service_1.DataProviderService])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map