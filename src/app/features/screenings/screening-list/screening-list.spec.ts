import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreeningList } from './screening-list';

describe('ScreeningList', () => {
  let component: ScreeningList;
  let fixture: ComponentFixture<ScreeningList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreeningList],
    }).compileComponents();

    fixture = TestBed.createComponent(ScreeningList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
