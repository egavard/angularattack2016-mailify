import {bootstrap} from '@angular/platform-browser-dynamic'
import { AppComponent} from './app.component';
import {DataProviderService} from './services/data-provider.service';
import {ColorPickerService} from './libs/color-picker/color-picker.service'
import {DataGenerator} from "./services/data-generator.service";
import { ROUTER_PROVIDERS } from '@angular/router';
import { HTTP_PROVIDERS } from '@angular/http';
import {ModulesService} from "./services/modules.service";
import { MODAL_DIRECTIVES } from 'ng2-bs3-modal/ng2-bs3-modal';


bootstrap(AppComponent, [ROUTER_PROVIDERS, HTTP_PROVIDERS, DataProviderService, ColorPickerService, DataGenerator, ModulesService, MODAL_DIRECTIVES]);
