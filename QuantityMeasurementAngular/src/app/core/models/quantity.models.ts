export type MeasurementCategory = 'Length' | 'Weight' | 'Volume' | 'Temperature';
export type QuantityAction = 'Comparison' | 'Conversion' | 'Arithmetic';
export type ArithmeticOperation = 'ADD' | 'SUBTRACT' | 'DIVIDE';

export interface QuantityDto {
  category: MeasurementCategory;
  unit: string;
  value: number;
}

export interface CompareRequest {
  first: QuantityDto;
  second: QuantityDto;
}

export interface CompareResponse {
  equal: boolean;
}

export interface ConvertRequest {
  quantity: QuantityDto;
  targetUnit: string;
}

export interface ConvertResponse {
  result: QuantityDto;
}

export interface AddRequest {
  first: QuantityDto;
  second: QuantityDto;
  resultUnit: string;
}

export interface AddResponse {
  result: QuantityDto;
}

export interface SubtractRequest {
  first: QuantityDto;
  second: QuantityDto;
  resultUnit: string;
}

export interface SubtractResponse {
  result: QuantityDto;
}

export interface DivideRequest {
  first: QuantityDto;
  second: QuantityDto;
}

export interface DivideResponse {
  ratio: number;
}