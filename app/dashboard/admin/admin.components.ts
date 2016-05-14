import {Component} from '@angular/core';
import {ModulesService} from "../../services/modules.service";
import {ModuleMetadata} from "../../modules/module-metadata.model";
import {DebugModule} from "../../modules/debug-module.component";

@Component({
    selector: 'home',
    templateUrl: './app/dashboard/admin/admin.html',
    directives: [ DebugModule ]
})
export class AdminComponent {
    private availableModules: ModuleMetadata[];

    constructor(private modulesService: ModulesService) {
        this.availableModules = modulesService.getAvailableModules();
    }
}