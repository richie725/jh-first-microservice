import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBill } from '../bill.model';
import { BillService } from '../service/bill.service';

@Injectable({ providedIn: 'root' })
export class BillRoutingResolveService implements Resolve<IBill | null> {
  constructor(protected service: BillService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBill | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((bill: HttpResponse<IBill>) => {
          if (bill.body) {
            return of(bill.body);
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
