import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAmount } from '../amount.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../amount.test-samples';

import { AmountService } from './amount.service';

const requireRestSample: IAmount = {
  ...sampleWithRequiredData,
};

describe('Amount Service', () => {
  let service: AmountService;
  let httpMock: HttpTestingController;
  let expectedResult: IAmount | IAmount[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AmountService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Amount', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const amount = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(amount).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Amount', () => {
      const amount = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(amount).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Amount', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Amount', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Amount', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAmountToCollectionIfMissing', () => {
      it('should add a Amount to an empty array', () => {
        const amount: IAmount = sampleWithRequiredData;
        expectedResult = service.addAmountToCollectionIfMissing([], amount);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(amount);
      });

      it('should not add a Amount to an array that contains it', () => {
        const amount: IAmount = sampleWithRequiredData;
        const amountCollection: IAmount[] = [
          {
            ...amount,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAmountToCollectionIfMissing(amountCollection, amount);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Amount to an array that doesn't contain it", () => {
        const amount: IAmount = sampleWithRequiredData;
        const amountCollection: IAmount[] = [sampleWithPartialData];
        expectedResult = service.addAmountToCollectionIfMissing(amountCollection, amount);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(amount);
      });

      it('should add only unique Amount to an array', () => {
        const amountArray: IAmount[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const amountCollection: IAmount[] = [sampleWithRequiredData];
        expectedResult = service.addAmountToCollectionIfMissing(amountCollection, ...amountArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const amount: IAmount = sampleWithRequiredData;
        const amount2: IAmount = sampleWithPartialData;
        expectedResult = service.addAmountToCollectionIfMissing([], amount, amount2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(amount);
        expect(expectedResult).toContain(amount2);
      });

      it('should accept null and undefined values', () => {
        const amount: IAmount = sampleWithRequiredData;
        expectedResult = service.addAmountToCollectionIfMissing([], null, amount, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(amount);
      });

      it('should return initial array if no Amount is added', () => {
        const amountCollection: IAmount[] = [sampleWithRequiredData];
        expectedResult = service.addAmountToCollectionIfMissing(amountCollection, undefined, null);
        expect(expectedResult).toEqual(amountCollection);
      });
    });

    describe('compareAmount', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAmount(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareAmount(entity1, entity2);
        const compareResult2 = service.compareAmount(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareAmount(entity1, entity2);
        const compareResult2 = service.compareAmount(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareAmount(entity1, entity2);
        const compareResult2 = service.compareAmount(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
