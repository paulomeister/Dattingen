export interface ResponseDTO<T> {
  status: number;
  message: string;
  data: T;
}
