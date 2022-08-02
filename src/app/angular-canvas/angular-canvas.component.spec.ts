import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularCanvasComponent } from './angular-canvas.component';

describe('AngularCanvasComponent', () => {
  let component: AngularCanvasComponent;
  let fixture: ComponentFixture<AngularCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AngularCanvasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AngularCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
