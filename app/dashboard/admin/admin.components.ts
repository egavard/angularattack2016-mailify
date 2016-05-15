import {Component} from '@angular/core';
import {ModulesService} from '../../services/modules.service';
import {ModuleMetadata} from '../../modules/module-metadata.model';
import {DebugModule} from '../../modules/debug-module.component';
import {log} from '../../decorators/log.decorator';
import { AfterViewInit } from '@angular/core'
import {ChartModule} from '../../modules/chart-module.component';
import {DataProviderService} from '../../services/data-provider.service';
import {ChartPositionInformation} from '../../modules/chart-position-information';
declare var $;

@Component({
    selector: 'home',
    templateUrl: './app/dashboard/admin/admin.html',
    directives: [ DebugModule, ChartModule ]
})
export class AdminComponent implements AfterViewInit {
    private availableModules: ModuleMetadata[];
    private _items:ChartModule[];

    constructor(private modulesService: ModulesService, private dataProviderService:DataProviderService) {
        this.availableModules = modulesService.getAvailableModules();
        let storedItems = window.localStorage.getItem('charts');
        if(storedItems){
            this.items = storedItems;
        }else{
            let item1 = new ChartModule(dataProviderService);
            item1.chartPositionInformation = new ChartPositionInformation(0,0,5,1);
            let item2 = new ChartModule(dataProviderService);
            item2.chartPositionInformation = new ChartPositionInformation(6,0,5,1);

            this.items = [];
            this.items.push(item1, item2);
        }
    }

    ngAfterViewInit(){
        $('.gridster ul').gridster({
            max_cols:12,
            draggable:{
                start:function(event,ui){
                },
                drag:function(event,ui){

                },
                stop:function(event,ui){
                    console.log('stop');
                    console.log(event);
                    console.log(ui);
                }
            }
        });
    }

    get items():ChartModule[] {
        return this._items;
    }

    set items(value:Array<ChartModule>) {
        this._items = value;
    }
}