import {
  AnyAction,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import {RootState} from '.';
import {loadPopulation} from '../api';
import {FAVORITE_STATE_LIST, SELECTED_STATE} from '../constants';
import {storeArray, storeData} from '../helper';

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
  favoriteStateList?: string[];
}

const initState: PopulationStore = {
  value: 0,
  isLoading: false,
  error: undefined,
  list: [],
  selectedState: undefined,
  favoriteStateList: undefined,
};

export const counterSlice = createSlice({
  name: 'population',
  initialState: initState,
  reducers: {
    initFavorite: (state, action) => {
      state.favoriteStateList = action.payload;
    },
    addFavorite: (state, action) => {
      let newList;
      if (!state.favoriteStateList || state.favoriteStateList.length === 0) {
        newList = [action.payload];
      } else if (
        state.favoriteStateList.find(item => item !== action.payload)
      ) {
        newList = [...state.favoriteStateList, action.payload];
      }

      if (!newList) {
        return;
      }

      state.favoriteStateList = newList;
      storeArray(FAVORITE_STATE_LIST, newList);
    },
    removeFavorite: (state, action) => {
      const newList = state.favoriteStateList?.filter(
        item => item !== action.payload
      );

      state.favoriteStateList = newList;
      storeArray(FAVORITE_STATE_LIST, newList ?? []);
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

export const {initFavorite, addFavorite, removeFavorite} = counterSlice.actions;

export const selectCount = (state: RootState) => state.population.value;

export default counterSlice.reducer;
