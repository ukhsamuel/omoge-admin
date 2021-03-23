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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var data = require('./data.json');
var DynamicChartComponent = /** @class */ (function () {
    function DynamicChartComponent() {
        this.chartTypes = ['Bar', 'Line'];
        this.type = 'Bar';
        this.data = data['Bar'];
        this.options = {
            axisX: {
                showLabel: false
            },
            axisY: {
                showLabel: false
            }
        };
    }
    DynamicChartComponent = __decorate([
        core_1.Component({
            selector: 'app-dynamic-chart',
            template: "\n    <div class=\"row\">\n      <div class=\"col-md-6\">\n        <h4>Dynamic Chart Types</h4>\n      </div>\n      <div class=\"col-md-6\">\n        <select class=\"form-control\" [(ngModel)]=\"type\">\n          <option *ngFor=\"let type of chartTypes\" [ngValue]=\"type\">{{type}}</option>\n        </select>\n      </div>\n    </div>\n    <x-chartist\n      [data]=\"data\"\n      [type]=\"type\"\n      [options]=\"options\">\n    </x-chartist>\n  "
        }),
        __metadata("design:paramtypes", [])
    ], DynamicChartComponent);
    return DynamicChartComponent;
}());
exports.DynamicChartComponent = DynamicChartComponent;
//# sourceMappingURL=dynamic.component.js.map