import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IAmount, NewAmount } from '../amount.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAmount for edit and NewAmountFormGroupInput for create.
 */
type AmountFormGroupInput = IAmount | PartialWithRequiredKeyOf<NewAmount>;

type AmountFormDefaults = Pick<NewAmount, 'id'>;

type AmountFormGroupContent = {
  id: FormControl<IAmount['id'] | NewAmount['id']>;
  count: FormControl<IAmount['count']>;
};

export type AmountFormGroup = FormGroup<AmountFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AmountFormService {
  createAmountFormGroup(amount: AmountFormGroupInput = { id: null }): AmountFormGroup {
    const amountRawValue = {
      ...this.getFormDefaults(),
      ...amount,
    };
    return new FormGroup<AmountFormGroupContent>({
      id: new FormControl(
        { value: amountRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      count: new FormControl(amountRawValue.count),
    });
  }

  getAmount(form: AmountFormGroup): IAmount | NewAmount {
    return form.getRawValue() as IAmount | NewAmount;
  }

  resetForm(form: AmountFormGroup, amount: AmountFormGroupInput): void {
    const amountRawValue = { ...this.getFormDefaults(), ...amount };
    form.reset(
      {
        ...amountRawValue,
        id: { value: amountRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): AmountFormDefaults {
    return {
      id: null,
    };
  }
}
