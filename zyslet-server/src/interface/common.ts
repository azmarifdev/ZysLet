export type IGenericResposnse<T> = {
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: T;
};
