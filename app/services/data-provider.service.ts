import {Injectable} from '@angular/core';
import {DataGenerator} from './data-generator.service';
import {Charts} from '../models/charts.model';

// Quick & dirty !
@Injectable()
export class DataProviderService {

    constructor(private dataGenerator:DataGenerator) {
    }

    getBasicCharts(numberOfCategories = 8, numberOfSeries = 2):Charts {
        var dummyData = this.dataGenerator.generateDummyData(numberOfCategories, numberOfSeries);
        return new Charts(dummyData);
    }
}