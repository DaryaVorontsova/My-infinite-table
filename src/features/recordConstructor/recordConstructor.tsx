import React, { useState } from 'react';
import type { FieldType, Field } from '../../types/record';
import { createRecord } from '../../shared/api/recordsApi';
import { validateField } from './validation';

const TYPE_OPTIONS: { value: FieldType; label: string }[] = [
  { value: 'string', label: 'Текст' },
  { value: 'number', label: 'Число' },
  { value: 'boolean', label: 'Да/Нет' },
  { value: 'date', label: 'Дата' },
  { value: 'email', label: 'E-mail' },
];

export const RecordConstructor: React.FC<{ onSuccess?: () => void }> = ({
  onSuccess,
}) => {
  const [fields, setFields] = useState<Field[]>([
    { key: '', type: 'string', value: '', error: undefined },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const addField = () => {
    setFields([...fields, { key: '', type: 'string', value: '' }]);
  };

  const removeField = (idx: number) => {
    setFields(fields.filter((_, i) => i !== idx));
  };

  const handleFieldChange = (idx: number, prop: keyof Field, val: string) => {
    setFields(fields =>
      fields.map((f, i) =>
        i === idx ? { ...f, [prop]: val, error: undefined } : f,
      ),
    );
  };

  const validateAll = () => {
    let valid = true;

    setFields(fields =>
      fields.map(f => {
        const error = validateField(f);

        if (error) {
          valid = false;
        }

        return { ...f, error };
      }),
    );

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (fields.length < 5) {
      setFormError('Добавьте минимум 5 полей.');

      return;
    }

    if (!validateAll()) {
      setFormError('Заполните все поля корректно.');

      return;
    }

    setSubmitting(true);

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

    try {
      await createRecord(fields);
      setFields([{ key: '', type: 'string', value: '' }]);

      if (onSuccess) {
        onSuccess();
      }
    } catch {
      setFormError('Ошибка при отправке');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      className="border rounded p-3 mb-4"
      onSubmit={handleSubmit}
      style={{ maxWidth: 550 }}
    >
      <h5 className="mb-3">Конструктор новой записи</h5>
      <p className="py-1 mb-1">Добавьте минимум 5 полей:</p>
      {fields.map((field, idx) => (
        <div className="row mb-2" key={idx}>
          <div className="col-3">
            <input
              className={`form-control ${field.error && !field.key ? 'is-invalid' : ''}`}
              placeholder="Название поля"
              value={field.key}
              onChange={e => handleFieldChange(idx, 'key', e.target.value)}
              disabled={submitting}
              required
            />
          </div>
          <div className="col-3">
            <select
              className="form-select"
              value={field.type}
              onChange={e => handleFieldChange(idx, 'type', e.target.value)}
              disabled={submitting}
            >
              {TYPE_OPTIONS.map(opt => (
                <option value={opt.value} key={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-3">
            {field.type === 'boolean' ? (
              <select
                className={`form-select ${field.error && !field.value ? 'is-invalid' : ''}`}
                value={field.value}
                onChange={e => handleFieldChange(idx, 'value', e.target.value)}
                disabled={submitting}
                required
              >
                <option value="">Выберите...</option>
                <option value="true">Да</option>
                <option value="false">Нет</option>
              </select>
            ) : (
              <input
                className={`form-control ${field.error && !field.value ? 'is-invalid' : ''}`}
                type={
                  field.type === 'number'
                    ? 'number'
                    : field.type === 'date'
                      ? 'date'
                      : 'text'
                }
                value={field.value}
                onChange={e => handleFieldChange(idx, 'value', e.target.value)}
                disabled={submitting}
                required
              />
            )}
          </div>
          <div className="col-3">
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => removeField(idx)}
              disabled={fields.length <= 1 || submitting}
              tabIndex={-1}
            >
              Удалить
            </button>
          </div>
          {field.error && (
            <div className="text-danger small ms-2">{field.error}</div>
          )}
        </div>
      ))}
      <div className="mb-2">
        <button
          type="button"
          className="btn btn-secondary me-2"
          onClick={addField}
          disabled={submitting}
        >
          + Добавить поле
        </button>
      </div>
      {formError && <div className="alert alert-danger py-1">{formError}</div>}
      <button
        type="submit"
        className="btn btn-primary"
        disabled={submitting || fields.length < 5}
      >
        {submitting ? 'Сохраняю...' : 'Создать запись'}
      </button>
    </form>
  );
};
