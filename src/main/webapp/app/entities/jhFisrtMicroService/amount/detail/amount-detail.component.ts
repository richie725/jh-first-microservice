import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAmount } from '../amount.model';

@Component({
  selector: 'jhi-amount-detail',
  templateUrl: './amount-detail.component.html',
})
export class AmountDetailComponent implements OnInit {
  amount: IAmount | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ amount }) => {
      this.amount = amount;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
