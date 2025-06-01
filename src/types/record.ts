export type RecordValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Record<string, unknown>
  | Array<unknown>;
export type RecordType = { [key: string]: RecordValue };
