import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilmCreateComponent } from './film-create';

describe('FilmCreate', () => {
  let component: FilmCreateComponent;
  let fixture: ComponentFixture<FilmCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilmCreateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FilmCreateComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
