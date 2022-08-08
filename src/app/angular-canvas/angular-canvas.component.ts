import { Component, OnInit } from '@angular/core';
import { CanvasComponent } from 'angular-canvas';

@CanvasComponent
@Component({
  selector: 'app-angular-canvas',
  templateUrl: './angular-canvas.component.html',
  styleUrls: ['./angular-canvas.component.scss'],
})
export class AngularCanvasComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
