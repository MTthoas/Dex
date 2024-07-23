import { apiUrl } from "@/hook/index";
import { Transaction } from "@/types/transaction.type";


export async function getTransactions(){
    const response = await fetch(apiUrl + "transactions");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  }
  
  export async function getTransactionByHash(hash: string): Promise<Transaction> {
    const response = await fetch(apiUrl + `transactions/hash/${hash}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  }

  export async function postTransaction(data: any) {
    console.log(data)
    const response = await fetch(apiUrl + "transactions", {
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

  export async function deleteTransaction(id: number) {
    const response = await fetch(apiUrl + `transactions/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  }