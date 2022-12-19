import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAmount, NewAmount } from '../amount.model';

export type PartialUpdateAmount = Partial<IAmount> & Pick<IAmount, 'id'>;

export type EntityResponseType = HttpResponse<IAmount>;
export type EntityArrayResponseType = HttpResponse<IAmount[]>;

@Injectable({ providedIn: 'root' })
export class AmountService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/amounts', 'jhfisrtmicroservice');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(amount: NewAmount): Observable<EntityResponseType> {
    return this.http.post<IAmount>(this.resourceUrl, amount, { observe: 'response' });
  }

  update(amount: IAmount): Observable<EntityResponseType> {
    return this.http.put<IAmount>(`${this.resourceUrl}/${this.getAmountIdentifier(amount)}`, amount, { observe: 'response' });
  }

  partialUpdate(amount: PartialUpdateAmount): Observable<EntityResponseType> {
    return this.http.patch<IAmount>(`${this.resourceUrl}/${this.getAmountIdentifier(amount)}`, amount, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAmount>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAmount[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAmountIdentifier(amount: Pick<IAmount, 'id'>): number {
    return amount.id;
  }

  compareAmount(o1: Pick<IAmount, 'id'> | null, o2: Pick<IAmount, 'id'> | null): boolean {
    return o1 && o2 ? this.getAmountIdentifier(o1) === this.getAmountIdentifier(o2) : o1 === o2;
  }

  addAmountToCollectionIfMissing<Type extends Pick<IAmount, 'id'>>(
    amountCollection: Type[],
    ...amountsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const amounts: Type[] = amountsToCheck.filter(isPresent);
    if (amounts.length > 0) {
      const amountCollectionIdentifiers = amountCollection.map(amountItem => this.getAmountIdentifier(amountItem)!);
      const amountsToAdd = amounts.filter(amountItem => {
        const amountIdentifier = this.getAmountIdentifier(amountItem);
        if (amountCollectionIdentifiers.includes(amountIdentifier)) {
          return false;
        }
        amountCollectionIdentifiers.push(amountIdentifier);
        return true;
      });
      return [...amountsToAdd, ...amountCollection];
    }
    return amountCollection;
  }
}
