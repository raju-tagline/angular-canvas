import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphLineComponent } from './graph-line.component';

describe('GraphLineComponent', () => {
  let component: GraphLineComponent;
  let fixture: ComponentFixture<GraphLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphLineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
