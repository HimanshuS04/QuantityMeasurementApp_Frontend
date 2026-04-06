import { MeasurementCategory } from '../../core/models/quantity.models';

export function getUnitsForCategory(category: MeasurementCategory): string[] {
  switch (category) {
    case 'Length':
      return ['feet', 'inch', 'yard', 'centimeter'];
    case 'Weight':
      return ['kilogram', 'gram', 'pound'];
    case 'Volume':
      return ['litre', 'millilitre', 'gallon'];
    case 'Temperature':
      return ['celsius', 'fahrenheit', 'kelvin'];
    default:
      return [];
  }
}

export function capitalize(text: string): string {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : '';
}