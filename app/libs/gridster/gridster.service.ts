/**
 * Created by egavard on 14/05/16.
 */
    import {Injectable} from '@angular/core'
import {GridsterItem} from './gridster';
import {Gridster} from './gridster.component';
@Injectable()
export class GridsterDraggableService{
    private _item:GridsterItem;
    private _gridster:Gridster;
}
@Injectable()
export class GridsterResizableService{
    
}