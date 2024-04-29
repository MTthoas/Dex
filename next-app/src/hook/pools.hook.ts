import { apiUrl } from "@/hook/index";

export async function getPools() {
    const response = await fetch(apiUrl + "pools");
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
}

export async function getPoolByAddress(address: string) {
    const response = await fetch(apiUrl + `pools/address/${address}`);
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
}

export async function createPool(data: any): Promise<any> {
    const response = await fetch(apiUrl + "pools", {
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

export async function deletePool(address: string) {
    const response = await fetch(apiUrl + `pools/address/${address}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
}

