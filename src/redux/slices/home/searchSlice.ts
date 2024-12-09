// store/searchSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface SearchState {
  searchText: string;
  searchStatus: 'idle' | 'loading' | 'valid' | 'invalid' | 'error';
}

const initialState: SearchState = {
  searchText: '',
  searchStatus: 'idle',
};

// Async thunk for submitting a search
export const submitSearch = createAsyncThunk(
  'search/submitSearch',
  async (searchText: string, { rejectWithValue }) => {
    try {
      // Replace this with an actual API call or async operation
      const isValid = searchText.trim() !== ''; // Simulated validation
      if (isValid) {
        return searchText;
      } else {
        throw new Error('Invalid search text');
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to submit search');
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    updateSearch(state, action: PayloadAction<string>) {
      state.searchText = action.payload;
      state.searchStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitSearch.pending, (state) => {
        state.searchStatus = 'loading';
      })
      .addCase(submitSearch.fulfilled, (state, action: PayloadAction<string>) => {
        state.searchText = action.payload;
        state.searchStatus = 'valid';
      })
      .addCase(submitSearch.rejected, (state, action) => {
        state.searchStatus = 'invalid';
        console.error('Search error:', action.payload);
      });
  },
});

export const { updateSearch } = searchSlice.actions;

export default searchSlice.reducer;
