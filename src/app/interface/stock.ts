import { Flower } from "./flower";
import { Florist } from "./florist";
import { FlowerPrice } from "./flower-price"
export interface Stock {
    id: number,
    flower: Flower,
    quantity: number,
    unit: string,
    lot: Date,
    florist: Florist
    flowerPrice: FlowerPrice
    deleteQty: number
}