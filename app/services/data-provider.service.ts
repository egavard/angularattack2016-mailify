import { Injectable } from '@angular/core';
import { DataGenerator } from './data-generator.service';

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
@Injectable()
export class DataProviderService {

    constructor(private dataGenerator: DataGenerator) {
    }

    getBasicChart(numberOfCategories = 8, numberOfSeries = 2) {
      return this.dataGenerator.generateDummyData(numberOfCategories, numberOfSeries);
    }
}