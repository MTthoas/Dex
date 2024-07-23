import { CreateUserRequest, apiUrl } from "@/hook/index";

export async function getUsers() {
  const response = await fetch(apiUrl + "users");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export async function getUserByAdress(address: string): Promise<any> {
  const response = await fetch(apiUrl + `users/address/${address}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export async function getUsersBanned(): Promise<any> {
  const response = await fetch(apiUrl + "users/banned");
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

export async function updateUser(
  id: number,
  data: Partial<CreateUserRequest>
): Promise<any> {
  const response = await fetch(apiUrl + `users/${id}`, {
    method: "PUT",
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

export async function deleteUser(id: number): Promise<any> {
  const response = await fetch(apiUrl + `users/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}
