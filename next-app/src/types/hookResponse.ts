export type Hook<T> = {
  data: T;
  error: Error | null;
  isError: boolean;
};

export type User = {
  id: number;
  name: string;
  address: string;
  created_at: string;
  updated_at: string;
};
