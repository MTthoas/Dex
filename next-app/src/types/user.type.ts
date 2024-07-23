import { BaseResponse } from "./hookResponse.type";

export interface User extends BaseResponse {
    id: number;
    name: string;
    address: string;
    banned: string;
};