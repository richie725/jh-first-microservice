import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBill, NewBill } from '../bill.model';

export type PartialUpdateBill = Partial<IBill> & Pick<IBill, 'id'>;

export type EntityResponseType = HttpResponse<IBill>;
export type EntityArrayResponseType = HttpResponse<IBill[]>;

@Injectable({ providedIn: 'root' })
export class BillService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/bills', 'jhfisrtmicroservice');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(bill: NewBill): Observable<EntityResponseType> {
    return this.http.post<IBill>(this.resourceUrl, bill, { observe: 'response' });
  }

  update(bill: IBill): Observable<EntityResponseType> {
    return this.http.put<IBill>(`${this.resourceUrl}/${this.getBillIdentifier(bill)}`, bill, { observe: 'response' });
  }

  partialUpdate(bill: PartialUpdateBill): Observable<EntityResponseType> {
    return this.http.patch<IBill>(`${this.resourceUrl}/${this.getBillIdentifier(bill)}`, bill, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBill>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBill[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getBillIdentifier(bill: Pick<IBill, 'id'>): number {
    return bill.id;
  }

  compareBill(o1: Pick<IBill, 'id'> | null, o2: Pick<IBill, 'id'> | null): boolean {
    return o1 && o2 ? this.getBillIdentifier(o1) === this.getBillIdentifier(o2) : o1 === o2;
  }

  addBillToCollectionIfMissing<Type extends Pick<IBill, 'id'>>(
    billCollection: Type[],
    ...billsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const bills: Type[] = billsToCheck.filter(isPresent);
    if (bills.length > 0) {
      const billCollectionIdentifiers = billCollection.map(billItem => this.getBillIdentifier(billItem)!);
      const billsToAdd = bills.filter(billItem => {
        const billIdentifier = this.getBillIdentifier(billItem);
        if (billCollectionIdentifiers.includes(billIdentifier)) {
          return false;
        }
        billCollectionIdentifiers.push(billIdentifier);
        return true;
      });
      return [...billsToAdd, ...billCollection];
    }
    return billCollection;
  }
}
