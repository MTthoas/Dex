import { apiUrl } from "@/hook/index";

export async function getTokens() {
  const response = await fetch(apiUrl + "tokens");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export async function getTokenByAddress(address: string) {
  const response = await fetch(apiUrl + `tokens/address/${address}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export async function createToken(data: any): Promise<any> {
  const response = await fetch(apiUrl + "tokens", {
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

export async function deleteToken(address: string) {
  const response = await fetch(apiUrl + `tokens/address/${address}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}
