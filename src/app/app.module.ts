import { GraphLineElement } from './canvas.element';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CanvasComponent } from './canvas/canvas.component';
import { AngularCanvasComponent } from './angular-canvas/angular-canvas.component';
import { CanvasDomModule } from 'angular-canvas';
// import { GraphLineComponent } from './graph-line/graph-line.component';

@NgModule({
  declarations: [AppComponent, CanvasComponent, AngularCanvasComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CanvasDomModule.forRoot([GraphLineElement]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
