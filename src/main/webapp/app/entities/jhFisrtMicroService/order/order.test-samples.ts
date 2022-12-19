import { IOrder, NewOrder } from './order.model';

export const sampleWithRequiredData: IOrder = {
  id: 47761,
};

export const sampleWithPartialData: IOrder = {
  id: 52696,
  address: 'web-enabled bypassing Communications',
};

export const sampleWithFullData: IOrder = {
  id: 82425,
  name: 'Division 香港',
  address: 'indigo microchip Fantastic',
};

export const sampleWithNewData: NewOrder = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
