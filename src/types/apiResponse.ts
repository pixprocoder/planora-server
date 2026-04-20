export type IPaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type IApiResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  meta?: IPaginationMeta;
  data?: T;
};
