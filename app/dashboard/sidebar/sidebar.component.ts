import {Component} from '@angular/core';
import {CORE_DIRECTIVES} from '@angular/common';
import { ACCORDION_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';

@Component({
	selector: 'sidebar',
	templateUrl: './app/dashboard/sidebar/sidebar.html',
	directives: [ACCORDION_DIRECTIVES, CORE_DIRECTIVES]
})
export class SidebarComponent {
}
