export interface StatusValue {
  value: number;
  label: string;
  color: string;
  clickAction?: (status: StatusValue) => void;
}
