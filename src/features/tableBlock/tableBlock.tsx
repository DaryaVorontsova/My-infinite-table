import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loadRecords, setPage } from './recordsSlice';
import {
  selectRecords,
  selectColumns,
  selectLoading,
  selectError,
  selectorHasMore,
  selectorPage,
  selectorLimit,
} from './selectors';
import InfiniteScroll from 'react-infinite-scroll-component';
import type { RecordValue } from '../../types/record';

export const TableBlock: React.FC = () => {
  const dispatch = useAppDispatch();

  const records = useAppSelector(selectRecords);
  const columns = useAppSelector(selectColumns);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const hasMore = useAppSelector(selectorHasMore);
  const page = useAppSelector(selectorPage);
  const limit = useAppSelector(selectorLimit);

  useEffect(() => {
    dispatch(loadRecords({ page: 1, limit }));
  }, [dispatch, limit]);

  const fetchMoreData = () => {
    const nextPage = page + 1;

    dispatch(loadRecords({ page: nextPage, limit }));
    dispatch(setPage(nextPage));
  };

  function renderCell(val: RecordValue): string {
    if (val === null || val === undefined) {
      return '';
    }

    if (val === '') {
      return 'Данных нет';
    }

    if (Array.isArray(val)) {
      return val.length ? val.join(', ') : '';
    }

    if (typeof val === 'object') {
      const pairs = Object.entries(val)
        .filter(([, v]) => v !== '' && v !== null && v !== undefined)
        .map(([k, v]) => `${k}:${v}`);

      return pairs.length ? pairs.join(', ') : '';
    }

    return String(val);
  }

  return (
    <div className="ms-3 me-3 mt-2 p-0">
      <h2>Таблица записей</h2>
      {error && <div className="text-danger text-center">{error}</div>}
      {loading && records.length === 0 ? (
        <div className="text-center my-4">Загрузка...</div>
      ) : (
        <InfiniteScroll
          dataLength={records.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<div className="text-center my-4">Загрузка...</div>}
          endMessage={
            <div className="text-center text-muted">Все данные загружены</div>
          }
        >
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                {columns.map(col => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((rec, i) => (
                <tr key={i}>
                  {columns.map(col => (
                    <td key={col}>
                      {Object.prototype.hasOwnProperty.call(rec, col)
                        ? renderCell(rec[col])
                        : ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </InfiniteScroll>
      )}
    </div>
  );
};
