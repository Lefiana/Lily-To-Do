// src/types/gacha.ts
export interface GachaResult {
  item?: {
    id: string;
    name: string;
    rarity: string;
    description?: string;
    imageURL?: string;
  };
  newBalance: number;
  // Add other properties if your performGacha returns more (e.g., success status)
}

export interface InventoryItem {
  id: string;
  name: string;
  imageURL?: string;
  count: number;
  rarity: string;
  description?: string;
  // Add other properties if your inventory data has more
}