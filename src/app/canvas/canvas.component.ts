import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { tap, concatMap, takeUntil } from 'rxjs/operators';

export enum Direction {
  up,
  left,
  down,
  right,
}

export const DistanceConfig: any = {
  up: {
    x: 0,
    y: 10,
  },
  left: {
    x: -10,
    y: 0,
  },
  down: {
    x: 0,
    y: -10,
  },
  right: {
    x: 10,
    y: 0,
  },
};

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements OnInit, AfterViewInit {
  cx: any;
  canvas = { width: 500, height: 500 };
  currentLocation = { x: 200, y: 200 };
  preDirection!: string;

  locationList: any = [];

  @ViewChild('myCanvas', { static: false }) myCanvas!: ElementRef;

  constructor(private el: ElementRef) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    const canvasEl: HTMLCanvasElement = this.myCanvas.nativeElement;
    this.cx = canvasEl.getContext('2d');

    const mouseMove$: any = fromEvent(this.myCanvas.nativeElement, 'mousemove');
    const mouseDown$: any = fromEvent(this.myCanvas.nativeElement, 'mousedown');
    const mouseUp$: any = fromEvent(this.myCanvas.nativeElement, 'mouseup');

    mouseDown$.pipe(concatMap((down) => mouseMove$.pipe(takeUntil(mouseUp$))));

    const mouseDraw$: any = mouseDown$.pipe(
      tap((e: MouseEvent) => {
        this.cx.moveTo(e.offsetX, e.offsetY);
      }),
      concatMap(() => mouseMove$.pipe(takeUntil(mouseUp$)))
    );

    mouseDraw$.subscribe((e: MouseEvent) => this.draw(e.offsetX, e.offsetY));
  }
  draw(offsetX: any, offsetY: any) {
    this.cx.lineTo(offsetX, offsetY);
    this.cx.stroke();
  }

  autoDraw() {
    const runTimes = 100;
    for (let i = 0; i < runTimes; i++) {
      this.excuteAutoDraw();
    }
  }

  excuteAutoDraw() {
    const direction = this.getDirection();

    const distance = DistanceConfig[direction];
    const newLocation: any = { ...this.currentLocation };
    newLocation.x = newLocation.x + distance.x;
    newLocation.y = newLocation.y + distance.y;

    if (this.isNewPath(newLocation)) {
      this.cx.moveTo(this.currentLocation.x, this.currentLocation.y);
      this.cx.lineTo(newLocation.x, newLocation.y);
      this.cx.stroke();

      this.currentLocation = newLocation;
      this.locationList.push(newLocation);
    }
  }

  isNewPath(newLoc: { x: number; y: number }) {
    const idx = this.locationList.findIndex(
      (oldLoc: any) => oldLoc.x === newLoc.x && oldLoc.y == newLoc.y
    );
    return idx == -1;
  }

  getDirection() {
    const idx = Math.floor(Math.random() * 4);
    return Direction[idx];
  }

  refresh() {
    this.cx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
