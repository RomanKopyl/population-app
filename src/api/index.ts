import {PopulationType} from '../store/reducer';

export const loadPopulation = async () => {
  const response = await fetch(
    'https://datausa.io/api/data?drilldowns=State&measures=Population'
  );
  const data = await response.json();

  return data.data as PopulationType[];
};
