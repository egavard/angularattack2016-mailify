import { Component, ViewEncapsulation } from '@angular/core';
import { ROUTER_DIRECTIVES, Routes } from '@angular/router';
import {TopNavComponent} from './dashboard/topnav/topnav.component';
import {SidebarComponent} from './dashboard/sidebar/sidebar.component';
import {HomeComponent} from './dashboard/home/home.component';
import {AdminComponent} from "./dashboard/admin/admin.components";

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
}