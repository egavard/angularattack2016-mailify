import {bootstrap} from '@angular/platform-browser-dynamic'
import { AppComponent} from './app.component';
import {DataProviderService} from './services/data-provider.service';
import {ColorPickerService} from './libs/color-picker/color-picker.service'
import {DataGenerator} from "./services/data-generator.service";
import { ROUTER_PROVIDERS } from '@angular/router';

bootstrap(AppComponent, [ROUTER_PROVIDERS, DataProviderService, ColorPickerService, DataGenerator]);