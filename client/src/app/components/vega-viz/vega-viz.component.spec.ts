import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VegaVizComponent } from './vega-viz.component';

describe('VegaVizComponent', () => {
  let component: VegaVizComponent;
  let fixture: ComponentFixture<VegaVizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VegaVizComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VegaVizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
