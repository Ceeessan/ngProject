import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerDeviceComponent } from './player-device.component';

describe('PlayerDeviceComponent', () => {
  let component: PlayerDeviceComponent;
  let fixture: ComponentFixture<PlayerDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerDeviceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
