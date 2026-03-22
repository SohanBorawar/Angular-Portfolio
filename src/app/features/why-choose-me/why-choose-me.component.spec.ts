import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyChooseMeComponent } from './why-choose-me.component';

describe('WhyChooseMeComponent', () => {
  let component: WhyChooseMeComponent;
  let fixture: ComponentFixture<WhyChooseMeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhyChooseMeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhyChooseMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
