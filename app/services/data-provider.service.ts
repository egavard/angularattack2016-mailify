import {Injectable} from '@angular/core';
import {DataGenerator} from './data-generator.service';
import {Chart} from '../models/chart.model';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class DataProviderService {

    constructor(private http: Http, private dataGenerator:DataGenerator) {
    }

    getBasicChartFromRandomData(numberOfCategories = 8, numberOfSeries = 2, maxValue = 100):Promise<Chart> {
        return Promise.resolve(
            this.dataGenerator.generateDummyData(numberOfCategories, numberOfSeries, maxValue).then((data: any) => {
                return new Chart(data.labels, data.series);
            })
        );
    }
    
    getBasicChartFromSourceUrl(sourceUrl: string) {
        return Promise.resolve(this.http.get(sourceUrl)
            .map((data: any) => {
                console.log(data);
                return new Chart(data.labels, data.series);
            })
        );
    }
}