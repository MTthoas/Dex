const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export interface CreateUserRequest {
  address: string;
  name: string;
}

export async function getUsers() {
  const response = await fetch(apiUrl + "users");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export async function getUserByAdress(address: string) {
  const response = await fetch(apiUrl + `users/address/${address}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export async function createUser(data: CreateUserRequest): Promise<any> {
  const response = await fetch(apiUrl + "users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}