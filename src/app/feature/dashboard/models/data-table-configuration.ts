import { SortMode } from '../constant/sort-mode';

export interface DataTableConfiguration {
  page: number;
  pageSize: number;
  sortBy: string;
  sortMode: SortMode;
  search: string;
}
