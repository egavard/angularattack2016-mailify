
/**
 * Simple dummy data generator to be injected into charts
 */
export class DataGenerator {

    generateDummyData(numberOfCategories:number, numberOfSeries:number, maxValue = 100) {
        let data = {labels:[],series:[]};

        for (let i = 0; i < numberOfCategories; ++i) {
            data.labels.push(`Label ${i}`);
        }

        for (let j = 0; j < numberOfSeries; ++j) {
            var values = [];
            for (let k = 0; k < numberOfCategories; ++k) {
                values.push(this.getRandomInt(0, maxValue));
            }
            data.series.push({
                title: `Series ${j}`,
                points: values
            });
        }
        // simulate raw JSON string from remote call
        return Promise.resolve(data);
    }

    /**
     * Returns a random integer between min (inclusive) and max (inclusive)
     * Using Math.round() will give you a non-uniform distribution!
     */
    private getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}