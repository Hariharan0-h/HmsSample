import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HmsRegistrationComponent } from './hms-registration.component';

describe('HmsRegistrationComponent', () => {
  let component: HmsRegistrationComponent;
  let fixture: ComponentFixture<HmsRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HmsRegistrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HmsRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
