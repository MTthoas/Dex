export enum EnumTransactionType {
    Send = "send",
    Swap = "swap",
    Stack = "stack",
    Unstack = "unstack",
    Claim = "claim",
    AddLiquidity = "add_liquidity",
    RemoveLiquidity = "remove_liquidity",
}

export interface Transaction {
    id: number; // example: 1
    from: string;  // example: "0x123abc"
    to: string;    // example: "0x456def"
    hash: string;  // example: "0x789ghi"
    amount_a: number; // example: 99.99
    amount_b: number; // example: 0
    type: EnumTransactionType; // example: EnumTransactionType.Send
    symbol_a?: string; // example: "ETH"
    symbol_b?: string; // example: "USDT"
    created_at: string; // example: "2021-10-10T10:00:00.000Z"
    updated_at: string; // example: "2021-10-10T10:00:00.000Z"
}
