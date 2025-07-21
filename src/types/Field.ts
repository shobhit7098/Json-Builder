export interface Field {
  id: string;
  key: string;
  type: string;
  nested?: boolean;
  fields?: Field[];
}
