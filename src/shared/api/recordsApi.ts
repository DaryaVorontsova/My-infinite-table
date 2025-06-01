import axios from 'axios';
import type { RecordType } from '../../types/record';
import { API_URL } from './link';

export interface FetchRecordsResponse {
  data: RecordType[];
  next: number | null;
  last: number;
}

export const fetchRecords = async (
  page: number,
  limit: number,
): Promise<FetchRecordsResponse> => {
  const response = await axios.get(
    `${API_URL}/records?_page=${page}&_per_page=${limit}`,
  );

  return response.data;
};
