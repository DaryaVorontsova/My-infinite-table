import { validateField } from '../validation';
import type { Field } from '../../../types/record';

describe('Функция validateField', () => {
  it('Должна вернуть ошибку если не указано имя поля', () => {
    const field: Field = { key: '', type: 'string', value: '' };

    expect(validateField(field)).toBe('Введите имя поля');
  });

  it('Должна вернуть ошибку если имя поля содержит недопустимые символы', () => {
    const field: Field = { key: 'имя-поля!', type: 'string', value: 'тест' };

    expect(validateField(field)).toBe('Только буквы, цифры, _ и -');
  });

  it('Должна вернуть ошибку если email невалидный', () => {
    const field: Field = { key: 'email', type: 'email', value: 'not-email' };

    expect(validateField(field)).toBe('Некорректный email');
  });

  it('Должна вернуть ошибку если значение числа некорректно', () => {
    const field: Field = { key: 'age', type: 'number', value: 'abc' };

    expect(validateField(field)).toBe('Введите число');
  });

  it('Должна вернуть ошибку если значение даты некорректно', () => {
    const field: Field = { key: 'date', type: 'date', value: 'нет даты' };

    expect(validateField(field)).toBe('Некорректная дата');
  });

  it('Должна вернуть ошибку если значение boolean не true/false', () => {
    const field: Field = { key: 'active', type: 'boolean', value: 'yes' };

    expect(validateField(field)).toBe('Введите true или false');
  });

  it('Должна вернуть ошибку если значение пустое', () => {
    const field: Field = { key: 'name', type: 'string', value: '    ' };

    expect(validateField(field)).toBe('Введите значение');
  });

  it('Должна вернуть undefined для корректного поля типа string', () => {
    const field: Field = { key: 'name', type: 'string', value: 'Анна' };

    expect(validateField(field)).toBeUndefined();
  });

  it('Должна вернуть undefined для корректного email', () => {
    const field: Field = {
      key: 'email',
      type: 'email',
      value: 'test@mail.com',
    };

    expect(validateField(field)).toBeUndefined();
  });

  it('Должна вернуть undefined для корректного числа', () => {
    const field: Field = { key: 'age', type: 'number', value: '32' };

    expect(validateField(field)).toBeUndefined();
  });

  it('Должна вернуть undefined для корректной даты', () => {
    const field: Field = { key: 'date', type: 'date', value: '2024-06-05' };

    expect(validateField(field)).toBeUndefined();
  });

  it('Должна вернуть undefined для корректного boolean', () => {
    const field: Field = { key: 'active', type: 'boolean', value: 'true' };

    expect(validateField(field)).toBeUndefined();
  });
});
