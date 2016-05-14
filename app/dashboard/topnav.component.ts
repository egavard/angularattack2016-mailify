import {Component} from '@angular/core';
import {CORE_DIRECTIVES} from '@angular/common';
import {DROPDOWN_DIRECTIVES, ACCORDION_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

@Component({
    selector: 'topnav',
    templateUrl: './app/dashboard/topnav.html',
    directives: [ DROPDOWN_DIRECTIVES, CORE_DIRECTIVES, ACCORDION_DIRECTIVES ]
})
export class TopNavComponent {
}