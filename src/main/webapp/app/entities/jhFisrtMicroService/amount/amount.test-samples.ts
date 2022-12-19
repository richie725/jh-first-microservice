import { IAmount, NewAmount } from './amount.model';

export const sampleWithRequiredData: IAmount = {
  id: 68789,
};

export const sampleWithPartialData: IAmount = {
  id: 79586,
};

export const sampleWithFullData: IAmount = {
  id: 89881,
  count: 76379,
};

export const sampleWithNewData: NewAmount = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
