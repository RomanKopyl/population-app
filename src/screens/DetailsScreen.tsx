import React from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';
import {ChartView} from '../components/ChartView';
import {RootState} from '../store';
import {useAppSelector} from '../store/hooks';

export const DetailsScreen: React.FC = () => {
  const selectedState = useAppSelector(
    (state: RootState) => state.population.selectedState
  );

  return (
    <SafeAreaView>
      <Text style={styles.header}>{selectedState}</Text>
      <ChartView />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
  },
});
