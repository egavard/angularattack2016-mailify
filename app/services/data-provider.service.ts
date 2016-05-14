import {Injectable} from '@angular/core';
import {DataGenerator} from './data-generator.service';
import {Chart} from '../models/chart.model';

// Quick & dirty !
@Injectable()
export class DataProviderService {

    constructor(private dataGenerator:DataGenerator) {
    }

    getBasicChart(numberOfCategories = 8, numberOfSeries = 2):Promise<Chart> {
        return Promise.resolve(
            this.dataGenerator.generateDummyData(numberOfCategories, numberOfSeries).then((data: any) => {
                return new Chart(data.labels, data.charts);
            })
        );
    }
}