import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AmountComponent } from '../list/amount.component';
import { AmountDetailComponent } from '../detail/amount-detail.component';
import { AmountUpdateComponent } from '../update/amount-update.component';
import { AmountRoutingResolveService } from './amount-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const amountRoute: Routes = [
  {
    path: '',
    component: AmountComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AmountDetailComponent,
    resolve: {
      amount: AmountRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AmountUpdateComponent,
    resolve: {
      amount: AmountRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AmountUpdateComponent,
    resolve: {
      amount: AmountRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(amountRoute)],
  exports: [RouterModule],
})
export class AmountRoutingModule {}
