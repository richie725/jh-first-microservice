import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AmountFormService } from './amount-form.service';
import { AmountService } from '../service/amount.service';
import { IAmount } from '../amount.model';

import { AmountUpdateComponent } from './amount-update.component';

describe('Amount Management Update Component', () => {
  let comp: AmountUpdateComponent;
  let fixture: ComponentFixture<AmountUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let amountFormService: AmountFormService;
  let amountService: AmountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AmountUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(AmountUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AmountUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    amountFormService = TestBed.inject(AmountFormService);
    amountService = TestBed.inject(AmountService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const amount: IAmount = { id: 456 };

      activatedRoute.data = of({ amount });
      comp.ngOnInit();

      expect(comp.amount).toEqual(amount);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAmount>>();
      const amount = { id: 123 };
      jest.spyOn(amountFormService, 'getAmount').mockReturnValue(amount);
      jest.spyOn(amountService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ amount });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: amount }));
      saveSubject.complete();

      // THEN
      expect(amountFormService.getAmount).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(amountService.update).toHaveBeenCalledWith(expect.objectContaining(amount));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAmount>>();
      const amount = { id: 123 };
      jest.spyOn(amountFormService, 'getAmount').mockReturnValue({ id: null });
      jest.spyOn(amountService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ amount: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: amount }));
      saveSubject.complete();

      // THEN
      expect(amountFormService.getAmount).toHaveBeenCalled();
      expect(amountService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAmount>>();
      const amount = { id: 123 };
      jest.spyOn(amountService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ amount });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(amountService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
