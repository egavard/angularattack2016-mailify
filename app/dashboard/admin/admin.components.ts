import {Component} from '@angular/core';
import {ModulesService} from "../../services/modules.service";
import {ModuleMetadata} from "../../modules/module-metadata.model";

@Component({
    selector: 'home',
    templateUrl: './app/dashboard/admin/admin.html'
})
export class AdminComponent {
    private availableModules: ModuleMetadata[];

    constructor(private modulesService: ModulesService) {
        this.availableModules = modulesService.getAvailableModules();
    }
}