import {Type} from '@angular/core'
export interface ModuleMetadata {
    getIcon: () => string;
    getName: () => string;
    getType: () => Type;
}