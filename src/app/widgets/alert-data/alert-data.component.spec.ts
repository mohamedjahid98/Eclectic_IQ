import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AlertDataComponent } from './alert-data.component';

describe('AlertDataComponent', () => {
  let component: AlertDataComponent;
  let fixture: ComponentFixture<AlertDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
