export type AllDayInCurrentYearArr = Array<DayInfo>;
export interface DayInfo {
  date: string;
  isholiday?: boolean;
  isWork?: boolean;
  name?: string;
  type?: string;
  desc?: string;
}

export interface ArrayT {
  date?: string;
}

export type HolidayInfo = string[];

export interface Info {
  name?: string;
  start?: string;
  startYear?: string;
  endYear?: string;
  end?: string;
  workDays?: string[];
  desc?: string;
}
export type InfoArray = Array<Info>;

export interface Event {
  start: string[];
  end: string[];
  title: string;
  // status: string;
  productId: string;
  description: string;
}
export type EventArray = Event[];

export interface Result {
  holidayEvents: EventArray;
  lunarEvents: EventArray;
}

export interface JieQiObj {
  date: string;
  name: string;
}

export interface DayConfig {
  lunar?: string;
  date: string;
  name: string;
  description?: string;
}
export interface Temp {
  [key: string]: DayConfig;
}

export interface StatusProps {
  status: boolean;
  error?: NodeJS.ErrnoException | undefined | null;
}
