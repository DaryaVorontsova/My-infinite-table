import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RecordType } from '../../types/record';
import type { FetchRecordsResponse } from '../../shared/api/recordsApi';
import { fetchRecords } from '../../shared/api/recordsApi';

interface RecordsState {
  records: RecordType[];
  columns: string[];
  loading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  limit: number;
}

const initialState: RecordsState = {
  records: [],
  columns: [],
  loading: false,
  error: null,
  page: 1,
  hasMore: true,
  limit: 10,
};

export const loadRecords = createAsyncThunk<
  FetchRecordsResponse,
  { page: number; limit: number }
>('records/loadRecords', async ({ page, limit }) => {
  return await fetchRecords(page, limit);
});

const recordsSlice = createSlice({
  name: 'records',
  initialState,
  reducers: {
    setPage(state, action: { payload: number }) {
      state.page = action.payload;
    },
    resetRecords(state) {
      state.records = [];
      state.page = 1;
      state.hasMore = true;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadRecords.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadRecords.fulfilled, (state, action) => {
        const { data, next } = action.payload;

        if (!next) {
          state.hasMore = false;
        }

        state.records = [...state.records, ...data];

        const columnsSet = new Set<string>(state.columns);

        data.forEach(record => {
          Object.keys(record).forEach(key => columnsSet.add(key));
        });
        state.columns = Array.from(columnsSet);

        state.loading = false;
      })
      .addCase(loadRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки';
      });
  },
});

export const { setPage, resetRecords } = recordsSlice.actions;
export default recordsSlice.reducer;
