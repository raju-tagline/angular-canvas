import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  OnInit,
} from '@angular/core';
import { CanvasComponent } from 'angular-canvas';

@CanvasComponent
@Component({
  selector: 'app-graph-canvas',
  templateUrl: './graph-canvas.component.html',
  styleUrls: ['./graph-canvas.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class GraphCanvasComponent implements OnInit {
  public mouseX: any;
  public data: any;
  public step: any;
  public deltaX: any;
  public data2: any;
  public data3: any;

  constructor() {}

  ngOnInit(): void {}
}
