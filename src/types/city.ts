import { State, City } from 'country-state-city';

export interface CityOption {
  id: string;
  name: string;
  state: string;
  stateCode: string;
  active: boolean;
}

export interface StateOption {
  name: string;
  isoCode: string;
}

/** All Indian states from country-state-city */
export const getIndiaStates = (): StateOption[] => {
  return State.getStatesOfCountry('IN').map((s) => ({
    name: s.name,
    isoCode: s.isoCode,
  }));
};

/** Cities for a given India state ISO code (e.g. 'AP' for Andhra Pradesh) */
export const getCitiesForState = (stateCode: string): CityOption[] => {
  return City.getCitiesOfState('IN', stateCode).map((c) => ({
    id: `${stateCode}-${c.name}`,
    name: c.name,
    state: State.getStateByCodeAndCountry(stateCode, 'IN')?.name || stateCode,
    stateCode,
    active: true,
  }));
};
