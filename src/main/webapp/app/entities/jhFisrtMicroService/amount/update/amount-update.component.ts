import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { AmountFormService, AmountFormGroup } from './amount-form.service';
import { IAmount } from '../amount.model';
import { AmountService } from '../service/amount.service';

@Component({
  selector: 'jhi-amount-update',
  templateUrl: './amount-update.component.html',
})
export class AmountUpdateComponent implements OnInit {
  isSaving = false;
  amount: IAmount | null = null;

  editForm: AmountFormGroup = this.amountFormService.createAmountFormGroup();

  constructor(
    protected amountService: AmountService,
    protected amountFormService: AmountFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ amount }) => {
      this.amount = amount;
      if (amount) {
        this.updateForm(amount);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const amount = this.amountFormService.getAmount(this.editForm);
    if (amount.id !== null) {
      this.subscribeToSaveResponse(this.amountService.update(amount));
    } else {
      this.subscribeToSaveResponse(this.amountService.create(amount));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAmount>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(amount: IAmount): void {
    this.amount = amount;
    this.amountFormService.resetForm(this.editForm, amount);
  }
}
