import { Component, OnInit } from '@angular/core';
import { CanvasElement, NgCanvasElement, NgCanvas } from 'angular-canvas';

@Component({
  selector: 'graph-line',
  templateUrl: './graph-line.component.html',
  styleUrls: ['./graph-line.component.scss'],
})
export class GraphLineComponent implements OnInit {
  public parent!: NgCanvas;

  public needDraw!: boolean;

  constructor() {}

  ngOnInit(): void {}

  setNgProperty(name: string, value: any): void {
    // this[name] = value;

    // redraw all element in one canvas context after set ng property
    this.parent.drawAll();
  }

  draw(context: CanvasRenderingContext2D, time: number): void {
    context.strokeStyle = 'red';
  }
}
