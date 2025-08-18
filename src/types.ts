export type Row = { time: string; event: string };
export type ScheduleData = {
  title: string;
  dateRange: string;
  rows: Row[];
  theme: { bg: string; card: string; accent: string };
  size: { w: number; h: number };
  exportScale: number; // 1–4
};
