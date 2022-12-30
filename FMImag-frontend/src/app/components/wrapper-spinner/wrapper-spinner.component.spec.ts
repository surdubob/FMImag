import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapperSpinnerComponent } from './wrapper-spinner.component';

describe('WrapperSpinnerComponent', () => {
  let component: WrapperSpinnerComponent;
  let fixture: ComponentFixture<WrapperSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WrapperSpinnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WrapperSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
