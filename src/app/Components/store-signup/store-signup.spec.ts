import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreSignup } from './store-signup';

describe('StoreSignup', () => {
  let component: StoreSignup;
  let fixture: ComponentFixture<StoreSignup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreSignup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreSignup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
