import AsyncStorage from '@react-native-async-storage/async-storage';
import {PopulationType} from '../store/reducer';

export const getStates = (list: PopulationType[]) => {
  const states = list.map(item => item.State);
  let uniqueStates = states.filter((element, index) => {
    return states.indexOf(element) === index;
  });

  return uniqueStates;
};

export const filterByState = (value: string, list: PopulationType[]) => {
  const states = list.filter(item => item.State === value);

  return states;
};

export const storeData = async (key: string, value?: string) => {
  await AsyncStorage.setItem(key, value ?? key);
};

export const storeArray = async (key: string, list: string[]) => {
  await AsyncStorage.setItem(key, JSON.stringify(list));
};

export const retrieveData = async (key: string) => {
  const value = await AsyncStorage.getItem(key);
  if (value !== null) {
    console.log(value);
    return value;
  }
};

export const retrieveArray = async (key: string) => {
  const value = await AsyncStorage.getItem(key);
  if (value !== null) {
    return JSON.parse(value);
  }
};
