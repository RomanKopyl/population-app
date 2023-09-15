/* eslint-disable prettier/prettier */
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import reducer from './reducer';


const rootReducer = combineReducers({
    population: reducer,
});

export const store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
