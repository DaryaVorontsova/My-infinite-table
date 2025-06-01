import type { Field } from '../../types/record';

export function validateField(field: Field): string | undefined {
  if (!field.key.trim()) {
    return 'Введите имя поля';
  }

  if (!/^[a-zA-Zа-яА-Я0-9_-]+$/.test(field.key)) {
    return 'Только буквы, цифры, _ и -';
  }

  if (field.type === 'email' && field.value) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(field.value)) {
      return 'Некорректный email';
    }
  }

  if (field.type === 'number' && field.value) {
    if (isNaN(Number(field.value))) {
      return 'Введите число';
    }
  }

  if (field.type === 'date' && field.value) {
    if (isNaN(Date.parse(field.value))) {
      return 'Некорректная дата';
    }
  }

  if (field.type === 'boolean' && !['true', 'false'].includes(field.value)) {
    return 'Введите true или false';
  }

  if (!field.value.trim()) {
    return 'Введите значение';
  }

  return undefined;
}
