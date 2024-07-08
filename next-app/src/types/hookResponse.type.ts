export type Hook<T> = {
  data: T;
  error: Error | null;
  isError: boolean;
};

export type BaseResponse = {
  id: number;
  created_at: string;
  updated_at: string;
};


export interface User extends BaseResponse {
  name: string;
  address: string;
  created_at: string;
  updated_at: string;
};

export interface Transaction extends BaseResponse {
  from: string;
  to: string;
  amount: number;
  transaction: string;
}