import {Component} from '@angular/core';
import {ModulesService} from "../../services/modules.service";
import {ModuleMetadata} from "../../modules/module-metadata.model";
import {DebugModule} from "../../modules/debug-module.component";
import {GridsterItem} from '../../libs/gridster/gridster';
declare var $;

@Component({
    selector: 'home',
    templateUrl: './app/dashboard/admin/admin.html',
    directives: [ DebugModule ]
})
export class AdminComponent {
    private availableModules: ModuleMetadata[];
    private _items:GridsterItem[];

    constructor(private modulesService: ModulesService) {
        this.availableModules = modulesService.getAvailableModules();
        $('.gridster').gridster({
            max_cols:12,
            draggable:{
                stop:function(event,ui){
                    console.log('stop');
                    console.log(event);
                },
                start:function(event,ui){

                }
            }
        })
    }


    get items():GridsterItem[] {
        return this._items;
    }

    set items(value:Array) {
        this._items = value;
    }
}