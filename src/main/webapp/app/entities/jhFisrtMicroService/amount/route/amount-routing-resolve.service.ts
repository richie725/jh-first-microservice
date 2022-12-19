import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAmount } from '../amount.model';
import { AmountService } from '../service/amount.service';

@Injectable({ providedIn: 'root' })
export class AmountRoutingResolveService implements Resolve<IAmount | null> {
  constructor(protected service: AmountService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAmount | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((amount: HttpResponse<IAmount>) => {
          if (amount.body) {
            return of(amount.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
