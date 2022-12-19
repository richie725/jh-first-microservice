import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../amount.test-samples';

import { AmountFormService } from './amount-form.service';

describe('Amount Form Service', () => {
  let service: AmountFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmountFormService);
  });

  describe('Service methods', () => {
    describe('createAmountFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAmountFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            count: expect.any(Object),
          })
        );
      });

      it('passing IAmount should create a new form with FormGroup', () => {
        const formGroup = service.createAmountFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            count: expect.any(Object),
          })
        );
      });
    });

    describe('getAmount', () => {
      it('should return NewAmount for default Amount initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createAmountFormGroup(sampleWithNewData);

        const amount = service.getAmount(formGroup) as any;

        expect(amount).toMatchObject(sampleWithNewData);
      });

      it('should return NewAmount for empty Amount initial value', () => {
        const formGroup = service.createAmountFormGroup();

        const amount = service.getAmount(formGroup) as any;

        expect(amount).toMatchObject({});
      });

      it('should return IAmount', () => {
        const formGroup = service.createAmountFormGroup(sampleWithRequiredData);

        const amount = service.getAmount(formGroup) as any;

        expect(amount).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAmount should not enable id FormControl', () => {
        const formGroup = service.createAmountFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAmount should disable id FormControl', () => {
        const formGroup = service.createAmountFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
