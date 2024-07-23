import { apiUrl } from "@/hook/index";

export async function getCoins() {
    const response = await fetch(apiUrl + "tokens");
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
}