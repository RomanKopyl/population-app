import React, {useMemo} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {BarChart} from 'react-native-gifted-charts';
import {itemType} from 'react-native-gifted-charts/src/BarChart/types';
import {filterByState} from '../helper';
import {RootState} from '../store';
import {useAppSelector} from '../store/hooks';

export const ChartView: React.FC = () => {
  const screenWidth = Dimensions.get('window').width;
  const selectedState = useAppSelector(
    (state: RootState) => state.population.selectedState
  );
  const list = useAppSelector((state: RootState) => state.population.list);

  const data = useMemo(() => {
    if (!list || list.length === 0 || selectedState?.length === 0) {
      return [];
    }

    const filteredList = filterByState(selectedState ?? '', list);
    const newList = filteredList
      .map(item => {
        return {
          value: item.Population,
          label: item.Year,
          frontColor: '#F7CF3D',
          spacing: 6,
        } as unknown as itemType;
      })
      .reverse();

    return newList;
  }, [list, selectedState]);

  return (
    <View>
      <BarChart
        data={data}
        width={screenWidth - 100}
        showVerticalLines
        noOfVerticalLines={7}
        verticalLinesSpacing={40}
        yAxisTextStyle={styles.textStyle}
        yAxisLabelWidth={90}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
  },
  headerContainer: {
    marginTop: 20,
  },
  textStyle: {
    color: 'gray',
  },
});
