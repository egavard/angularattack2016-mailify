/**
 * Created by egavard on 14/05/16.
 */
import { Component } from '@angular/core';
import {Gridster} from './libs/gridster/gridster.component';

@Component({
    selector:'app',
    moduleId:module.id,
    templateUrl:'./app.html',
    directives:[Gridster]
})
export class AppComponent{

}