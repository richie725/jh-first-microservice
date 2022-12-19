import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IBill, NewBill } from '../bill.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IBill for edit and NewBillFormGroupInput for create.
 */
type BillFormGroupInput = IBill | PartialWithRequiredKeyOf<NewBill>;

type BillFormDefaults = Pick<NewBill, 'id'>;

type BillFormGroupContent = {
  id: FormControl<IBill['id'] | NewBill['id']>;
  name: FormControl<IBill['name']>;
  amount: FormControl<IBill['amount']>;
  order: FormControl<IBill['order']>;
};

export type BillFormGroup = FormGroup<BillFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class BillFormService {
  createBillFormGroup(bill: BillFormGroupInput = { id: null }): BillFormGroup {
    const billRawValue = {
      ...this.getFormDefaults(),
      ...bill,
    };
    return new FormGroup<BillFormGroupContent>({
      id: new FormControl(
        { value: billRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(billRawValue.name),
      amount: new FormControl(billRawValue.amount),
      order: new FormControl(billRawValue.order),
    });
  }

  getBill(form: BillFormGroup): IBill | NewBill {
    return form.getRawValue() as IBill | NewBill;
  }

  resetForm(form: BillFormGroup, bill: BillFormGroupInput): void {
    const billRawValue = { ...this.getFormDefaults(), ...bill };
    form.reset(
      {
        ...billRawValue,
        id: { value: billRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): BillFormDefaults {
    return {
      id: null,
    };
  }
}
