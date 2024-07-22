export const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export interface CreateUserRequest {
  address: string;
  name: string;
  banned?: string;
}
