import React from 'react';
import {SafeAreaView} from 'react-native';
import {ChartView} from '../components/ChartView';
import {Header} from '../components/Header';
import {RootState} from '../store';
import {useAppSelector} from '../store/hooks';

export const DetailsScreen: React.FC = () => {
  const selectedState = useAppSelector(
    (state: RootState) => state.population.selectedState
  );

  return (
    <SafeAreaView>
      <Header title={selectedState} />
      <ChartView />
    </SafeAreaView>
  );
};
