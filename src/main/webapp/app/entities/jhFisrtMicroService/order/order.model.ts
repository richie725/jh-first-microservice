export interface IOrder {
  id: number;
  name?: string | null;
  address?: string | null;
}

export type NewOrder = Omit<IOrder, 'id'> & { id: null };
