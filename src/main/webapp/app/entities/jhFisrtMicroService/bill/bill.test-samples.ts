import { IBill, NewBill } from './bill.model';

export const sampleWithRequiredData: IBill = {
  id: 41506,
};

export const sampleWithPartialData: IBill = {
  id: 15148,
  amount: 76346,
};

export const sampleWithFullData: IBill = {
  id: 69307,
  name: 'interface',
  amount: 19864,
};

export const sampleWithNewData: NewBill = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
