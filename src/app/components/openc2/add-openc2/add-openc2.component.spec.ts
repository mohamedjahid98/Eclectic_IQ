import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddOpenc2Component } from './add-openc2.component';

describe('AddOpenc2Component', () => {
  let component: AddOpenc2Component;
  let fixture: ComponentFixture<AddOpenc2Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOpenc2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOpenc2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
