import {useNavigation} from '@react-navigation/core';
import React, {useCallback} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {back} from '../../res/images';

interface Props {
  title?: string;
  showBackButton?: boolean;
}

export const Header: React.FC<Props> = props => {
  const {title, showBackButton = true} = props;
  const {goBack} = useNavigation();

  const onPress = useCallback(() => {
    goBack();
  }, [goBack]);

  return (
    <View style={styles.container}>
      {showBackButton && (
        <TouchableOpacity
          style={styles.backButtonContainer}
          onPress={onPress}
          {...props}>
          <Image source={back} style={styles.image} />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 50,
    height: 50,
    justifyContent: 'center',
  },
  backButtonContainer: {
    position: 'absolute',
    left: 15,
    padding: 10,
  },
  image: {
    width: 12,
    height: 24,
  },
  title: {
    fontSize: 25,
    fontWeight: '600',
    textAlign: 'center',
  },
});
