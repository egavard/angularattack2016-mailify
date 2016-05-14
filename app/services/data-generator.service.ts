/**
 * Simple dummy data generator to be injected into charts
 */
export class DataGenerator {

    generateDummyData(numberOfCategories:number, numberOfCharts:number, maxValue = 100) {
        let data = {labels:[],charts:[]};

        for (let i of numberOfCategories) {
            data.labels.push('Label ${i}');
        }

        for (let j of numberOfCharts) {
            var values = [];
            for (let k of numberOfCategories) {
                values.push(this.getRandomInt(0, maxValue));
            }
            data.charts.push({
                title: 'Series ${j}',
                values: values
            });
        }
        // simulate raw JSON string from remote call
        return JSON.stringify(data);
    }

    /**
     * Returns a random integer between min (inclusive) and max (inclusive)
     * Using Math.round() will give you a non-uniform distribution!
     */
    private getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}