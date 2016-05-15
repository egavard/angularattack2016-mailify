import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
export const FIREBASE: string = 'https://aa2016-mailify.firebaseio.com';

@Injectable()
export class ModuleConfigService {
    constructor(private http: Http) {
    }

    getConfigById(configId: string) {
        return this.http.get(`${FIREBASE}/configs/${configId}.json`)
            .map(response => response.json());
    }

    saveConfig(configId: string, config: any) {
        if (configId) {
            return this.http.put(`${FIREBASE}/configs/${configId}.json`, JSON.stringify(config));
        } else {
            throw 'invalid config id';
        }
    }
}