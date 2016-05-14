import { Injectable } from '@angular/core';

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

    getBasicChart() {
      return "{\"labels\": [\"Group 1\", \"Group 2\", \"Group 3\", \"Group 4\", \"Group 5\"],\"charts\": " +
        "[{\"title\":\"Chart 1 \",\"values\": [1, 2, 3, 4, 5]}, {\"title\": \"Chart 2 \",\"values\": [1, 2, 3, 4, 5]}]}"
    }
}