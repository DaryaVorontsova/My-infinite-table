export type RecordValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Record<string, unknown>
  | Array<unknown>;
export type RecordType = { [key: string]: RecordValue };
export type FieldType = 'string' | 'number' | 'boolean' | 'date' | 'email';
export interface Field {
  key: string;
  type: FieldType;
  value: string;
  error?: string;
}
