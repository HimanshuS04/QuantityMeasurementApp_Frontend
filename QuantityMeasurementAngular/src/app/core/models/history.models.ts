export interface QuantityOperation {
  id?: number;
  userId?: number | null;
  category: string;
  operationType: string;
  firstValue: number;
  firstUnit: string;
  secondValue?: number | null;
  secondUnit?: string | null;
  resultValue?: number | null;
  resultUnit?: string | null;
}