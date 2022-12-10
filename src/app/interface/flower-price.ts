import { Flower } from "./flower";

export interface FlowerPrice {
    id: number,
    quantitySaleUnit: number,
    saleUnit: string,
    price: number,
    lot: Date,
    flower: Flower
}