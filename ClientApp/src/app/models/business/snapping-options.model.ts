export type SnappingOptions =
  | { type: 'tile'; i: number; j: number }
  | { type: 'free'; x: number; y: number };
