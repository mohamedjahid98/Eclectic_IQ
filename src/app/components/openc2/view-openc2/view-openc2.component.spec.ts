import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewOpenc2Component } from './view-openc2.component';

describe('ViewOpenc2Component', () => {
  let component: ViewOpenc2Component;
  let fixture: ComponentFixture<ViewOpenc2Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewOpenc2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewOpenc2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
