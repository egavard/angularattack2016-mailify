import {Component} from '@angular/core';
import {CORE_DIRECTIVES} from '@angular/common';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {ACCORDION_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

@Component({
	selector: 'sidebar',
	templateUrl: './app/dashboard/sidebar/sidebar.html',
	directives: [ACCORDION_DIRECTIVES, CORE_DIRECTIVES, ROUTER_DIRECTIVES]
})
export class SidebarComponent {
	
	private _condensed: boolean;

	get condensed():boolean{
            return this._condensed;
        }

	set condensed(value:boolean){
            this._condensed=value;
        }
}
