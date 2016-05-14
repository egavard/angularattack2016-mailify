/**
 * Created by egavard on 14/05/16.
 */
import {bootstrap} from '@angular/platform-browser-dynamic'
import { AppComponent} from './app.component';
import {DataProviderService} from './services/data-provider.service';
import {ColorPickerService} from './libs/color-picker/color-picker.service'
import {DataGenerator} from "./services/data-generator.service";
import { HTTP_PROVIDERS } from '@angular/http';

bootstrap(AppComponent, [HTTP_PROVIDERS, DataProviderService, ColorPickerService, DataGenerator]);