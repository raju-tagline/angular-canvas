import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { tap, concatMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements OnInit, AfterViewInit {
  @ViewChild('myCanvas', { static: false }) myCanvas!: ElementRef;
  public imageSrc: any;
  public isClear: boolean = false;
  cx: any;
  canvas = { width: 900, height: 350 };
  currentLocation = { x: 533, y: 0 };
  preDirection!: string;
  reader = new FileReader();

  locationList: any = [];

  constructor(private el: ElementRef) {}

  ngOnInit() {
    if (localStorage.getItem('canvas_drawing')) {
      const jsonData: any = localStorage.getItem('canvas_drawing');
      this.imageSrc = JSON.parse(jsonData).image;
      this.isClear = true;
    }
  }

  updateGridSize() {
    this.drawGrid(
      this.canvas.width,
      this.canvas.width / 3,
      this.canvas.width / 3
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
      const ctx: CanvasRenderingContext2D =
        this.myCanvas.nativeElement.getContext('2d');
      ctx.clearRect(0, 0, cw, ch);
      ctx.strokeStyle = '#333';
      // ctx.font = 'normal ' + Math.fround(squareSize / 3) + 'px arial';
      ctx.font = '25' + 'px sans-serif';
      ctx.fillStyle = 'orange';
      ctx.beginPath();
      for (let x = Math.fround(0.5); x < cw; x += squareSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, ch);

        const colLabel = '';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(colLabel, Math.fround(x + squareSize / 2), 0);
        ctx.setLineDash([5, 3]);
        // ctx.setLineDash([3, 3, 3, 3]);
      }
      // ctx.rect(10, 20, 150, 100);
      // ctx.fillRect(5, 10, 75, 50);

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
      tap((e: MouseEvent) => this.cx.moveTo(e.offsetX, e.offsetY)),
      concatMap(() => mouseMove$.pipe(takeUntil(mouseUp$)))
    );
    mouseDraw$.subscribe((e: MouseEvent) => this.draw(e.offsetX, e.offsetY));
    this.drawGrid(
      this.canvas.width,
      this.canvas.width / 3,
      this.canvas.width / 3
    );
    // const ctx1 = this.cx;

    // ctx1.beginPath();
    // ctx1.arc(240, 20, 40, 0, Math.PI);
    // ctx1.moveTo(100, 20);
    // ctx1.arc(60, 20, 40, 0, Math.PI);
    // ctx1.moveTo(215, 80);
    // ctx1.arc(150, 80, 65, 0, Math.PI);
    // ctx1.closePath();
    // ctx1.lineWidth = 6;
    // ctx1.stroke();

    // const ctx = this.cx;

    // ctx.beginPath();
    // ctx.shadowColor = 'rgba(255, 0, 0, .8)';
    // ctx.shadowBlur = 8;
    // ctx.shadowOffsetX = 30;
    // ctx.shadowOffsetY = 20;

    // ctx.fillStyle = 'rgba(0, 255, 0, .2)';
    // ctx.fillRect(10, 10, 150, 100);

    // ctx.lineWidth = 10;
    // ctx.strokeStyle = 'rgba(0, 0, 255, .6)';
    // ctx.strokeRect(10, 10, 150, 100);
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

  save() {
    const canvas: any = document.querySelector('canvas');
    const canvasContents: any = canvas.toDataURL();
    const data = { image: canvasContents, date: Date.now() };
    const drawJson = JSON.stringify(data);
    localStorage.setItem('canvas_drawing', drawJson);
    if (localStorage.getItem('canvas_drawing')) {
      const jsonData: any = localStorage.getItem('canvas_drawing');
      this.imageSrc = JSON.parse(jsonData).image;
      this.isClear = true;
    }
    // let string:any = JSON.stringify(data);
    // const file = new Blob([string], {
    //   type: 'application/json',
    // });

    // const a = document.createElement('a');
    // a.href = URL.createObjectURL(file);
    // a.download = 'canvas.json';
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);
  }

  clear() {
    localStorage.removeItem('canvas_drawing');
    this.cx.reset();
    this.isClear = false;
    this.updateGridSize();
  }

  excuteAutoDraw() {
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

    newDir.forEach((ele: any) => {
      if (ele) {
        const distance = ele;
        const newLocation: any = { ...ele };

        if (this.isNewPath(newLocation)) {
          this.currentLocation = { ...ele, y: 0 };
          this.cx.moveTo(this.currentLocation.x, this.currentLocation.y);
          this.cx.lineTo(newLocation.x, newLocation.y);

          this.currentLocation = newLocation;
          this.locationList.push(newLocation);
        }
        this.cx.strokeStyle = 'red';
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

  refresh() {
    this.cx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.updateGridSize();
  }
}
