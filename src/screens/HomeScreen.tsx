import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {ChartView} from '../components/ChartView';
import DropdownSelector, {
  DropdownItemInterface,
} from '../components/DropdownSelector';
import {FavoriteListView} from '../components/FavoriteListView';
import {Header} from '../components/Header';
import {FAVORITE_STATE_LIST, SELECTED_STATE} from '../constants';
import {getStates, retrieveArray, retrieveData, storeData} from '../helper';
import {RootState} from '../store';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {
  addFavorite,
  fetchPopulation,
  initFavorite,
  removeFavorite,
  setSelectedState,
} from '../store/reducer';

export const HomeScreen: React.FC = ({navigation}) => {
  const progress = useSharedValue(0);
  const reanimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
    };
  });
  const [showPreviews, setShowPreviews] = useState(true);

  const dispatch = useAppDispatch();
  const list = useAppSelector((state: RootState) => state.population.list);
  const favoriteStateList = useAppSelector(
    (state: RootState) => state.population.favoriteStateList
  );
  const selectedState = useAppSelector(
    (state: RootState) => state.population.selectedState
  );
  const isLoading = useAppSelector(
    (state: RootState) => state.population.isLoading
  );
  const isIncludes = selectedState
    ? favoriteStateList?.includes(selectedState)
    : false;

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
    retrieveArray(FAVORITE_STATE_LIST).then(result => {
      if (result) {
        // Save to redux
        dispatch(initFavorite(result));
      }
    });
  }, [currentState?.label, data, dispatch, selectedState]);

  const onSelected = (label: string) => {
    const duration = 1500;

    setShowPreviews(false);
    progress.value = withTiming(1, {duration: duration});
    setTimeout(() => {
      progress.value = withTiming(0);
      setShowPreviews(true);
    }, duration);

    // write new data to redux and local store
    dispatch(setSelectedState(label));
    storeData(SELECTED_STATE, label).catch(e => console.log(e));
  };

  const removeFromFavorite = useCallback(() => {
    dispatch(removeFavorite(selectedState));
  }, [dispatch, selectedState]);

  const addToFavorite = useCallback(() => {
    dispatch(addFavorite(selectedState));
  }, [dispatch, selectedState]);

  return (
    <SafeAreaView>
      {/* Screen header */}

      <Header title="Population in USA" showBackButton={false} />

      {/* Select by state */}
      <DropdownSelector
        data={data}
        state={currentState}
        onSelected={item => onSelected(item.label)}
      />

      {/* Population Chart by state */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator />
          <Text> Loading...</Text>
        </View>
      ) : (
        <>
          {showPreviews ? (
            <ChartView />
          ) : (
            <Animated.View style={[reanimatedStyle]}>
              <ChartView />
            </Animated.View>
          )}
        </>
      )}

      {/* Action buttons */}
      <View style={styles.buttonsView}>
        {isIncludes ? (
          <TouchableOpacity
            onPress={removeFromFavorite}
            style={styles.buttonStyle}>
            <Text style={styles.buttonTextStyle}>Remove from favorite</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={addToFavorite} style={styles.buttonStyle}>
            <Text style={styles.buttonTextStyle}>Add to favorite</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => navigation.navigate('Details')}
          style={styles.buttonStyle}>
          <Text style={styles.buttonTextStyle}>Go to details</Text>
        </TouchableOpacity>
      </View>

      {/* Favorite states list */}
      {favoriteStateList && favoriteStateList.length > 0 && (
        <FavoriteListView list={favoriteStateList} onSelected={onSelected} />
      )}
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
  buttonsView: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  buttonStyle: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 10,
    marginTop: 40,
    alignSelf: 'center',
  },
  buttonTextStyle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
  },
  itemView: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  itemTitle: {
    fontSize: 32,
  },
});
