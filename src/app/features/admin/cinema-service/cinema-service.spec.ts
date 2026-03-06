import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CinemaService } from './cinema-service';

describe('CinemaService', () => {
  let component: CinemaService;
  let fixture: ComponentFixture<CinemaService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CinemaService],
    }).compileComponents();

    fixture = TestBed.createComponent(CinemaService);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
