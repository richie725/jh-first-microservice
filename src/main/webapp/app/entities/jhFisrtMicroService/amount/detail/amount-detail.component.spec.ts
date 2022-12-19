import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AmountDetailComponent } from './amount-detail.component';

describe('Amount Management Detail Component', () => {
  let comp: AmountDetailComponent;
  let fixture: ComponentFixture<AmountDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AmountDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ amount: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AmountDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AmountDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load amount on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.amount).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
