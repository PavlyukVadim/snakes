import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import { StartComponent }  from './start.component';
import { MapComponent }  from './map.component';


@NgModule({
  imports: [ 
  	BrowserModule,
   ],
  declarations: [ 
  	AppComponent,
  	StartComponent,
  	MapComponent
   ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
