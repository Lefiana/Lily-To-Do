// src/lib/gacha.ts

// Define the shape of the data the function expects for better type safety
interface GachaItem {
  id: string;
  name: string;
  rarity: number;
  imageURL: string | null;
}

/**
 * Performs a weighted random selection from a list of items.
 * Assumes rarity is used as the weight.
 */
export function selectRandomItem(items: GachaItem[]): GachaItem {
    const totalWeight = items.reduce((sum, item) => sum + item.rarity, 0); 
    
    let randomNum = Math.random() * totalWeight;
    
    // Default to the first item in case of edge cases
    let selectedItem = items[0]; 
    
    for (const item of items) {
        if (randomNum < item.rarity) {
            selectedItem = item;
            break;
        }
        randomNum -= item.rarity;
    }
    return selectedItem;
}