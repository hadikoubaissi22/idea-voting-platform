import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeasPage } from './ideas-page';

describe('IdeasPage', () => {
  let component: IdeasPage;
  let fixture: ComponentFixture<IdeasPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdeasPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdeasPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
