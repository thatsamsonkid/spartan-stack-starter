import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiInputotpHelmComponent } from './ui-inputotp-helm.component';

describe('UiInputotpHelmComponent', () => {
  let component: UiInputotpHelmComponent;
  let fixture: ComponentFixture<UiInputotpHelmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiInputotpHelmComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UiInputotpHelmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
