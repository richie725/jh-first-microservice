export interface IAmount {
  id: number;
  count?: number | null;
}

export type NewAmount = Omit<IAmount, 'id'> & { id: null };
