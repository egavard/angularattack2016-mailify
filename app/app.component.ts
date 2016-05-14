/**
 * Created by egavard on 14/05/16.
 */
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import {Gridster} from './libs/gridster/gridster.component';
import {DebugModule} from './modules/debug-module.component';

@Component({
    selector:'app',
    moduleId:module.id,
    templateUrl:'./app.html',
    directives:[Gridster]
})
export class AppComponent implements AfterViewInit{
    @ViewChild(Gridster) gridster:Gridster;
    
    ngAfterViewInit(){
        let debugModule:DebugModule = new DebugModule(this.gridster);
        this.gridster.putItem(debugModule);
    }
}