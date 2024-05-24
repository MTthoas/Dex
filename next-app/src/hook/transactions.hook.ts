import { apiUrl } from "@/hook/index";

export async function getTransactions() {
    const response = await fetch(apiUrl + "transactions");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  }
  