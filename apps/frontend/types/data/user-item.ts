export interface UserItemData {
    characters: Record<number, UserItemDataCharacter>;
}

export interface UserItemDataCharacter {
    bags: Record<number, UserItemDataItem>;
    bank: Record<number, UserItemDataItem>;
}

export interface UserItemDataItem {
    count: number;
}
