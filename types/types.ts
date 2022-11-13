export interface Acc {
  label: string;
  mpan: string;
  serial: string;
  apikey: string;
}

export interface LineData {
  interval_end: number;
  consumption: number;
}

export interface Cons {
  label: string;
  data: LineData[];
}

export interface DailyData {
  interval_start: string;
  consumption: string;
}

export interface Daily {
  label: string;
  data: DailyData[];
}
