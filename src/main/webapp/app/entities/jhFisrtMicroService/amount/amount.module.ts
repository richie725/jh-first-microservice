import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AmountComponent } from './list/amount.component';
import { AmountDetailComponent } from './detail/amount-detail.component';
import { AmountUpdateComponent } from './update/amount-update.component';
import { AmountDeleteDialogComponent } from './delete/amount-delete-dialog.component';
import { AmountRoutingModule } from './route/amount-routing.module';

@NgModule({
  imports: [SharedModule, AmountRoutingModule],
  declarations: [AmountComponent, AmountDetailComponent, AmountUpdateComponent, AmountDeleteDialogComponent],
})
export class JhFisrtMicroServiceAmountModule {}
