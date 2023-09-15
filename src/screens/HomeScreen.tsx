import React, {useEffect, useMemo} from 'react';
import {
  ActivityIndicator,
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {ChartView} from '../components/ChartView';
import DropdownSelector, {
  DropdownItemInterface,
} from '../components/DropdownSelector';
import {SELECTED_STATE} from '../constants';
import {getStates, retrieveData, storeData} from '../helper';
import {RootState} from '../store';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {fetchPopulation, setSelectedState} from '../store/reducer';

export const HomeScreen: React.FC = ({navigation}) => {
  const dispatch = useAppDispatch();
  const list = useAppSelector((state: RootState) => state.population.list);
  const selectedState = useAppSelector(
    (state: RootState) => state.population.selectedState
  );
  const isLoading = useAppSelector(
    (state: RootState) => state.population.isLoading
  );

  const data = getStates(list).map((item, index) => {
    return {
      label: item,
      value: index,
      search: item,
    } as DropdownItemInterface;
  });

  const currentState = useMemo(() => {
    return data.find(item => item.label === selectedState);
  }, [data, selectedState]);

  useEffect(() => {
    // Load from server
    dispatch(fetchPopulation());
  }, [dispatch]);

  useEffect(() => {
    if (
      !data ||
      data.length === 0 ||
      (selectedState && selectedState?.length > 0)
    ) {
      return;
    }

    // Get saved state from locale storage
    retrieveData(SELECTED_STATE).then(result => {
      // Save to redux
      dispatch(setSelectedState(result ?? ''));
    });
  }, [currentState?.label, data, dispatch, selectedState]);

  const onSelected = (item: DropdownItemInterface) => {
    dispatch(setSelectedState(item.label));
    storeData(SELECTED_STATE, item.label).catch(e => console.log(e));
  };

  return (
    <SafeAreaView>
      <Text style={styles.header}>Population by state</Text>
      <DropdownSelector
        data={data}
        state={currentState}
        onSelected={onSelected}
      />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator />
          <Text> Loading...</Text>
        </View>
      ) : (
        <ChartView />
      )}
      <View style={styles.buttonContainer}>
        <Button
          onPress={() => navigation.navigate('Details')}
          title="Go to details"
          color="#841584"
        />
      </View>
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
  loadingContainer: {
    marginTop: 30,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonContainer: {
    marginTop: 50,
  },
});
