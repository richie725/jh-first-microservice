import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'order',
        data: { pageTitle: 'jhFisrtMicroServiceApp.jhFisrtMicroServiceOrder.home.title' },
        loadChildren: () => import('./jhFisrtMicroService/order/order.module').then(m => m.JhFisrtMicroServiceOrderModule),
      },
      {
        path: 'bill',
        data: { pageTitle: 'jhFisrtMicroServiceApp.jhFisrtMicroServiceBill.home.title' },
        loadChildren: () => import('./jhFisrtMicroService/bill/bill.module').then(m => m.JhFisrtMicroServiceBillModule),
      },
      {
        path: 'amount',
        data: { pageTitle: 'jhFisrtMicroServiceApp.jhFisrtMicroServiceAmount.home.title' },
        loadChildren: () => import('./jhFisrtMicroService/amount/amount.module').then(m => m.JhFisrtMicroServiceAmountModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
