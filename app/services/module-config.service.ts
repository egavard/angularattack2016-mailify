import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
export const FIREBASE:string = 'https://aa2016-mailify.firebaseio.com';

@Injectable()
export class ModuleConfigService {
    private _currentConfig:any;

    constructor(private http:Http) {
    }

    getConfigById(configId:string) {
        if (configId) {
            return this.http.get(`${FIREBASE}/configs/${configId}.json`)
                .map(response => response.json());
        } else {
            throw 'invalid config id';
        }
    }

    saveConfig(configId:string, config:any) {
        if (configId) {
            this._currentConfig = config;
            return this.http.put(`${FIREBASE}/configs/${configId}.json`, JSON.stringify(config));
        } else {
            throw 'invalid config id';
        }
    }
    
    get currentConfig():any {
        return this._currentConfig;
    }
}