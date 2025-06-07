export interface Account {
    id: number;
    accountId: number;
    region: number;

    // temporary leftovers
    enabled?: boolean;
    tag?: string;
}
