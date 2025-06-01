import axios from 'axios';
import type { RecordType, Field } from '../../types/record';
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

export async function createRecord(fields: Field[]) {
  const record: Record<string, unknown> = {};

  fields.forEach(f => {
    let val: unknown = f.value;

    if (f.type === 'number') {
      val = Number(f.value);
    }

    if (f.type === 'boolean') {
      val = f.value === 'true';
    }

    record[f.key] = val;
  });

  return axios.post(`${API_URL}/records`, record);
}
