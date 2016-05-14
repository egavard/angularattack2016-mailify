import { Component, ViewEncapsulation } from '@angular/core';
import { ROUTER_DIRECTIVES, Routes } from '@angular/router';
import {TopNavComponent} from './dashboard/topnav/topnav.component';
import {SidebarComponent} from './dashboard/sidebar/sidebar.component';
import {HomeComponent} from './dashboard/home/home.component';
import {AdminComponent} from "./dashboard/admin/admin.components";
import {GridsterItem} from './libs/gridster/gridster';
import {DebugModule} from './modules/debug-module.component';
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
    private _items: Array<GridsterItem>;
    constructor(){
        this._items = new Array<GridsterItem>();
        let item1 = new DebugModule(1,1,1,1);

        let item2 = new DebugModule(2,1,1,2);

        this._items.push(item1);
        this._items.push(item2);
    }
    ngAfterViewInit(){
        $(".gridster ul").gridster({
            widget_margins: [10, 10],
            widget_base_dimensions: [140, 140]
        })
    }
    get items():Array<GridsterItem> {
        return this._items;
    }

    set items(value:Array<GridsterItem>) {
        this._items = value;
    }

}