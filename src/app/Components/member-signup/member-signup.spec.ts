import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberSignup } from './member-signup';

describe('MemberSignup', () => {
  let component: MemberSignup;
  let fixture: ComponentFixture<MemberSignup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberSignup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberSignup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
