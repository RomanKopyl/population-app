import {
  AnyAction,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import {RootState} from '.';
import {loadPopulation} from '../api';
import {SELECTED_STATE} from '../constants';
import {storeData} from '../helper';

export type PopulationType = {
  'ID State': string;
  State: string;
  'ID Year': number;
  Year: number;
  Population: number;
  'Slug State': string;
};

export const fetchPopulation = createAsyncThunk<
  PopulationType[],
  undefined,
  {rejectValue: string}
>('population/fetchPopulation', async () => {
  return await loadPopulation();
});

export const setSelectedState = createAsyncThunk<
  string,
  string,
  {rejectValue: string}
>('population/setSelectedState', async value => {
  await storeData(SELECTED_STATE, value);
  return value;
});

function isError(action: AnyAction) {
  return action.type.endsWith('rejected');
}

interface PopulationStore {
  value: number;
  isLoading: boolean;
  error: unknown;
  list: PopulationType[];
  selectedState?: string;
}

const initState: PopulationStore = {
  value: 0,
  isLoading: false,
  error: undefined,
  list: [],
  selectedState: undefined,
};

export const counterSlice = createSlice({
  name: 'population',
  initialState: initState,
  reducers: {
    increment: state => {
      state.value += 1;
    },
    decrement: state => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchPopulation.pending, state => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchPopulation.fulfilled, (state, action) => {
      state.isLoading = false;
      state.list = action.payload;
    });
    builder.addCase(setSelectedState.fulfilled, (state, action) => {
      state.isLoading = false;
      state.selectedState = action.payload;
    });
    builder.addMatcher(isError, (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export const {increment, decrement, incrementByAmount} = counterSlice.actions;

export const selectCount = (state: RootState) => state.population.value;

export default counterSlice.reducer;
