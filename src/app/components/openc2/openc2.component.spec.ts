import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Openc2Component } from './openc2.component';

describe('Openc2Component', () => {
  let component: Openc2Component;
  let fixture: ComponentFixture<Openc2Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ Openc2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Openc2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
