import { IOrder } from 'app/entities/jhFisrtMicroService/order/order.model';

export interface IBill {
  id: number;
  name?: string | null;
  amount?: number | null;
  order?: Pick<IOrder, 'id'> | null;
}

export type NewBill = Omit<IBill, 'id'> & { id: null };
