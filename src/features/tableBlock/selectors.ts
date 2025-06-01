import type { RootState } from '../../app/store';

export const selectRecords = (state: RootState) => state.records.records;
export const selectColumns = (state: RootState) => state.records.columns;
export const selectLoading = (state: RootState) => state.records.loading;
export const selectError = (state: RootState) => state.records.error;
export const selectorHasMore = (state: RootState) => state.records.hasMore;
export const selectorPage = (state: RootState) => state.records.page;
export const selectorLimit = (state: RootState) => state.records.limit;
