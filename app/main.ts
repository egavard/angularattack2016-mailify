/**
 * Created by egavard on 14/05/16.
 */
import {bootstrap} from '@angular/platform-browser-dynamic'
import { AppComponent} from './app.component';
import {DataProviderService} from './services/data-provider.service';

bootstrap(AppComponent, [DataProviderService]);