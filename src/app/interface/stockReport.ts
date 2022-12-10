import { Flower } from "./flower";
import { Florist } from "./florist";
import { FlowerPrice } from "./flower-price"
export interface StockReport {
    id: number,
    flower: Flower,
    quantity: number,
    unit: string,
    lot: Date,
    florist: Florist,
    expireDate : number
    inPromotionQty : number,
    inPromotionSoldQty : number
    waste : number
}