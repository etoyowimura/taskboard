export type TPagination<T> = {
  data: T;
  page_size: number;
  next: string | null;
  previous: string | null;
};
