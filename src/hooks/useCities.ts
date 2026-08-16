import { getIndiaStates, getCitiesForState, CityOption, StateOption } from '../types/city';

/** All Indian states */
export function useStates(): StateOption[] {
  return getIndiaStates();
}

/** Cities for a given state ISO code. Defaults to 'AP' (Andhra Pradesh). */
export function useCitiesForState(stateCode: string): CityOption[] {
  if (!stateCode) return [];
  return getCitiesForState(stateCode);
}
