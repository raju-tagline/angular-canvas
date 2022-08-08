import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CanvasDomModule } from 'angular-canvas';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphLineElement } from './graphline-element';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CanvasDomModule.forRoot([GraphLineElement]),
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
