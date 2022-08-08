import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { tap, concatMap, takeUntil } from 'rxjs/operators';
import Canvas from '../canvas.json';

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
  @ViewChild('myCanvas', { static: false }) myCanvas!: ElementRef;
  public imageSrc: any;
  cx: any;
  canvas = { width: 1000, height: 500 };
  currentLocation = { x: 533, y: 0 };
  preDirection!: string;
  reader = new FileReader();

  locationList: any = [];

  constructor(private el: ElementRef) {
    console.log('this.el :>> ', this.el.nativeElement);
  }

  ngOnInit() {
    if (localStorage.getItem('canvas_drawing')) {
      const jsonData: any = localStorage.getItem('canvas_drawing');
      this.imageSrc = JSON.parse(jsonData).image;
    }
  }

  updateGridSize() {
    this.drawGrid(
      Math.fround(this.canvas.width),
      Math.fround(this.canvas.width / 3),
      Math.fround(this.canvas.width / 3)
    );
  }

  async drawGrid(w: number, h: number, s: number) {
    // Setup canvas size
    const cw = Math.fround(w + 1);
    const ch = Math.fround(h + 1);

    // Square Size
    const squareSize = Math.fround(s);

    // Resize canvas element
    if (this.myCanvas) {
      this.myCanvas.nativeElement.width = cw;
      this.myCanvas.nativeElement.height = ch;
      let rowCounter = 0;
      let colCounter = -1;
      // Canvas Context
      const ctx: CanvasRenderingContext2D =
        this.myCanvas.nativeElement.getContext('2d');
      // Clear any previous content
      ctx.clearRect(0, 0, cw, ch);
      // Set line color
      ctx.strokeStyle = '#333';
      // Set font size and color
      ctx.font = 'normal ' + Math.fround(squareSize / 3) + 'px arial';
      ctx.fillStyle = 'orange';

      // Drawing Setup
      ctx.beginPath();

      // const mouseMove$: any = fromEvent(
      //   this.myCanvas.nativeElement,
      //   'mousemove'
      // );
      // const mouseDown$: any = fromEvent(
      //   this.myCanvas.nativeElement,
      //   'mousedown'
      // );
      // const mouseUp$: any = fromEvent(this.myCanvas.nativeElement, 'mouseup');

      // mouseDown$.pipe(
      //   concatMap((down) => mouseMove$.pipe(takeUntil(mouseUp$)))
      // );

      // const mouseDraw$: any = mouseDown$.pipe(
      //   tap((e: MouseEvent) => {
      //     ctx.moveTo(e.offsetX, e.offsetY);
      //   }),
      //   concatMap(() => mouseMove$.pipe(takeUntil(mouseUp$)))
      // );

      // mouseDraw$.subscribe((e: MouseEvent) => {
      //   ctx.lineTo(e.offsetX, e.offsetY);
      //   ctx.stroke();
      // });

      // Vertical Lines and label
      for (let x = Math.fround(0.5); x < cw; x += squareSize) {
        // Lines
        ctx.moveTo(x, 0);
        ctx.lineTo(x, ch);
        // Label
        const colLabel = '';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(colLabel, Math.fround(x + squareSize / 2), 0);
        ctx.setLineDash([3, 3, 3, 3]);
      }

      // Drawing

      ctx.stroke();
    }
  }

  ngAfterViewInit(): void {
    const canvasEl: HTMLCanvasElement = this.myCanvas.nativeElement;
    this.cx = canvasEl.getContext('2d');

    const mouseMove$: any = fromEvent(this.myCanvas.nativeElement, 'mousemove');
    const mouseDown$: any = fromEvent(this.myCanvas.nativeElement, 'mousedown');
    const mouseUp$: any = fromEvent(this.myCanvas.nativeElement, 'mouseup');

    mouseDown$.pipe(concatMap((down) => mouseMove$.pipe(takeUntil(mouseUp$))));

    const mouseDraw$: any = mouseDown$.pipe(
      tap((e: MouseEvent) => 
        this.cx.moveTo(e.offsetX, e.offsetY)
      ),
      concatMap(() => mouseMove$.pipe(takeUntil(mouseUp$)))
    );
    mouseDraw$.subscribe((e: MouseEvent) => this.draw(e.offsetX, e.offsetY));
    this.drawGrid(
      this.canvas.width,
      this.canvas.width / 3,
      this.canvas.width / 3
    );
  }

  draw(offsetX: any, offsetY: any) {
    this.cx.lineTo(offsetX, offsetY);
    this.cx.stroke();
  }

  // autoDraw() {
  //   const runTimes = 100;
  //   for (let i = 0; i < runTimes; i++) {
  //     this.excuteAutoDraw();
  //   }
  // }

  save() {
    const canvas: any = document.querySelector('canvas');
    const canvasContents: any = canvas.toDataURL();
    const data = { image: canvasContents, date: Date.now() };
    const drawJson = JSON.stringify(data);
    localStorage.setItem('canvas_drawing', drawJson);
    if (localStorage.getItem('canvas_drawing')) {
      const jsonData: any = localStorage.getItem('canvas_drawing');
      this.imageSrc = JSON.parse(jsonData).image;
    }
    // console.log('string :>> ', drawJson);
    // const file = new Blob([string], {
    //   type: 'application/json',
    // });

    // const a = document.createElement('a');
    // a.href = URL.createObjectURL(file);
    // a.download = 'canvas.json';
    // document.body.appendChild(a);
    // a.click();
    // console.log('a :>> ', a);
    // document.body.removeChild(a);
  }

  clear() {
    localStorage.removeItem('canvas_drawing');
    this.cx.reset();
    this.updateGridSize();
  }

  excuteAutoDraw() {
    // const direction = this.getDirection();
    const newDir: any = [
      {
        x: this.canvas.width / 3,
        y: this.canvas.height,
      },
      {
        x: (this.canvas.width / 3) * 2,
        y: this.canvas.height,
      },
    ];

    // const distance = DistanceConfig[direction];
    newDir.forEach((ele: any) => {
      if (ele) {
        const distance = ele;
        const newLocation: any = { ...ele };
        // newLocation.x = newLocation.x;
        // newLocation.y = newLocation.y;

        if (this.isNewPath(newLocation)) {
          this.currentLocation = { ...ele, y: 0 };
          this.cx.moveTo(this.currentLocation.x, this.currentLocation.y);
          this.cx.lineTo(newLocation.x, newLocation.y);

          this.currentLocation = newLocation;
          this.locationList.push(newLocation);
        }
        this.cx.stroke();
      }
    });
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
    console.log('this.canvas.width :>> ', this.canvas.width);
    console.log('this.canvas.height :>> ', this.canvas.height);
    this.cx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
