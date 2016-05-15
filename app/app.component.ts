import { Component, ViewEncapsulation } from '@angular/core';
import { ROUTER_DIRECTIVES, Routes } from '@angular/router';
import {TopNavComponent} from './dashboard/topnav/topnav.component';
import {SidebarComponent} from './dashboard/sidebar/sidebar.component';
import {HomeComponent} from './dashboard/home/home.component';
import {AdminComponent} from "./dashboard/admin/admin.components";
import {ChartModule} from './modules/chart-module.component';
declare var $;
@Component({
    selector:'app',
    moduleId:module.id,
    templateUrl:'./app.html',
    encapsulation: ViewEncapsulation.None,
    directives:[ROUTER_DIRECTIVES, TopNavComponent, SidebarComponent]
})
@Routes([
    { path: '/', component: HomeComponent, useAsDefault:true},
    { path: '/admin', component: AdminComponent }
])
export class AppComponent {
    private _items:ChartModule[];
    constructor(){
        this._items = new Array<ChartModule>();
        let configId = window.localStorage.getItem('configId');
        if(configId == null || configId == undefined){
            configId ='xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            window.localStorage.setItem('configId',configId);
        }
    }
    ngAfterViewInit(){
    }
    get items():ChartModule[] {
        return this._items;
    }

    set items(value:Array<ChartModule>) {
        this._items = value;
    }

}