import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpModule } from '@angular/http';
import { AppComponent }  from './app.component';
import { StartComponent }  from './start.component';
import { MapComponent }  from './map.component';
import { LoginComponent }  from './login.component';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
  ],
  declarations: [
	  AppComponent,
	  StartComponent,
	  MapComponent,
    LoginComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
