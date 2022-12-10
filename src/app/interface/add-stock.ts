import { Florist } from "./florist";
import { Flower } from "./flower";

export interface AddStock {
    flower: Flower,
    quantity: number,
    lot: string,
    price: number,
    florist: Florist,
}