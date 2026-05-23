export type ApiListResponse<T> = {
  items: T[];
  total: number;
};

export type ApiItemResponse<T> = {
  item: T;
};
