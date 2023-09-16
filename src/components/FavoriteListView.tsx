import React from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Animated, {FadeOut, ZoomIn} from 'react-native-reanimated';
import {useAppDispatch} from '../store/hooks';
import {removeFavorite} from '../store/reducer';

export type ItemProps = {title: string};

interface FavoriteList {
  list?: string[];
  onSelected?: (item: string) => void;
}

export const FavoriteListView: React.FC<FavoriteList> = props => {
  const {list, onSelected} = props;
  const dispatch = useAppDispatch();

  const remove = (item: string) => dispatch(removeFavorite(item));

  return (
    <View>
      <Text style={styles.title}>Favorite states</Text>
      <FlatList
        data={list}
        renderItem={item => {
          return (
            <Animated.View
              key={item.index}
              entering={ZoomIn}
              exiting={FadeOut}
              style={styles.itemView}>
              <Text style={styles.itemTitle}>{item.item}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    console.log('remove: ', item);
                    remove(item.item);
                  }}>
                  <Text>Remove</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    // dispatch(setSelectedState(item.item));
                    onSelected?.(item.item);
                  }}>
                  <Text>Set current</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '500',
    alignSelf: 'center',
    marginTop: 20,
  },
  itemView: {
    backgroundColor: '#f9c2ff',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginLeft: 'auto',
    gap: 10,
  },
  button: {
    backgroundColor: 'orange',
    padding: 5,
    borderRadius: 8,
  },
});
