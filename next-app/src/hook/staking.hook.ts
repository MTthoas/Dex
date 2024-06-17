import { CreateUserRequest, apiUrl } from "@/hook/index";

export async function getStaking() {
    const response = await fetch(apiUrl + "staking");
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
}

export async function getStakingById(id: string) {
    const response = await fetch(apiUrl + `staking/${id}`);
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
}

export async function createStaking(data: any): Promise<any> {
    const response = await fetch(apiUrl + "staking", {
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

export async function deleteStaking(id: string) {
    const response = await fetch(apiUrl + `staking/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
}