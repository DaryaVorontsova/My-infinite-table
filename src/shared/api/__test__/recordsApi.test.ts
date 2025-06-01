import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { fetchRecords, createRecord } from '../recordsApi';
import type { Field } from '../../../types/record';

const mock = new MockAdapter(axios);

describe('API: fetchRecords и createRecord', () => {
  afterEach(() => {
    mock.reset();
  });

  it('Получение записи с сервера (get-запрос)', async () => {
    const responseData = {
      data: [{ id: 1, name: 'Иван' }],
      next: 2,
      last: 5,
    };
    mock.onGet(/\/records/).reply(200, responseData);

    const res = await fetchRecords(1, 10);

    expect(res).toEqual(responseData);
  });

  it('Отправление новой записи на сервер (post-запрос)', async () => {
    const fields: Field[] = [
      { key: 'name', value: 'Анна', type: 'string' },
      { key: 'age', value: '22', type: 'number' },
      { key: 'active', value: 'true', type: 'boolean' },
      { key: 'email', value: 'anna@example.com', type: 'email' },
      { key: 'date', value: '2024-06-01', type: 'date' },
    ];

    const expectedRecord = {
      name: 'Анна',
      age: 22,
      active: true,
      email: 'anna@example.com',
      date: '2024-06-01',
    };

    mock.onPost(/\/records/).reply(config => {
      const body = JSON.parse(config.data);
      expect(body).toEqual(expectedRecord);
      
      return [201, { ...body, id: 100 }];
    });

    const res = await createRecord(fields);

    expect(res.status).toBe(201);
    expect(res.data).toEqual({ ...expectedRecord, id: 100 });
  });
});
