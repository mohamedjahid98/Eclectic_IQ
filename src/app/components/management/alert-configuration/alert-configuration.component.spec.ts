import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AlertConfigurationComponent } from './alert-configuration.component';

describe('AlertConfigurationComponent', () => {
  let component: AlertConfigurationComponent;
  let fixture: ComponentFixture<AlertConfigurationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
