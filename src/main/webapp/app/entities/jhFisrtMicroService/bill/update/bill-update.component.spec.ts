import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BillFormService } from './bill-form.service';
import { BillService } from '../service/bill.service';
import { IBill } from '../bill.model';
import { IOrder } from 'app/entities/jhFisrtMicroService/order/order.model';
import { OrderService } from 'app/entities/jhFisrtMicroService/order/service/order.service';

import { BillUpdateComponent } from './bill-update.component';

describe('Bill Management Update Component', () => {
  let comp: BillUpdateComponent;
  let fixture: ComponentFixture<BillUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let billFormService: BillFormService;
  let billService: BillService;
  let orderService: OrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BillUpdateComponent],
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
      .overrideTemplate(BillUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BillUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    billFormService = TestBed.inject(BillFormService);
    billService = TestBed.inject(BillService);
    orderService = TestBed.inject(OrderService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Order query and add missing value', () => {
      const bill: IBill = { id: 456 };
      const order: IOrder = { id: 56578 };
      bill.order = order;

      const orderCollection: IOrder[] = [{ id: 68646 }];
      jest.spyOn(orderService, 'query').mockReturnValue(of(new HttpResponse({ body: orderCollection })));
      const additionalOrders = [order];
      const expectedCollection: IOrder[] = [...additionalOrders, ...orderCollection];
      jest.spyOn(orderService, 'addOrderToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ bill });
      comp.ngOnInit();

      expect(orderService.query).toHaveBeenCalled();
      expect(orderService.addOrderToCollectionIfMissing).toHaveBeenCalledWith(
        orderCollection,
        ...additionalOrders.map(expect.objectContaining)
      );
      expect(comp.ordersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const bill: IBill = { id: 456 };
      const order: IOrder = { id: 15039 };
      bill.order = order;

      activatedRoute.data = of({ bill });
      comp.ngOnInit();

      expect(comp.ordersSharedCollection).toContain(order);
      expect(comp.bill).toEqual(bill);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBill>>();
      const bill = { id: 123 };
      jest.spyOn(billFormService, 'getBill').mockReturnValue(bill);
      jest.spyOn(billService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bill });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bill }));
      saveSubject.complete();

      // THEN
      expect(billFormService.getBill).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(billService.update).toHaveBeenCalledWith(expect.objectContaining(bill));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBill>>();
      const bill = { id: 123 };
      jest.spyOn(billFormService, 'getBill').mockReturnValue({ id: null });
      jest.spyOn(billService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bill: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bill }));
      saveSubject.complete();

      // THEN
      expect(billFormService.getBill).toHaveBeenCalled();
      expect(billService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBill>>();
      const bill = { id: 123 };
      jest.spyOn(billService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bill });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(billService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareOrder', () => {
      it('Should forward to orderService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(orderService, 'compareOrder');
        comp.compareOrder(entity, entity2);
        expect(orderService.compareOrder).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
