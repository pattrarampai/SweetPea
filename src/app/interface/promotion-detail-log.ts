import { Florist } from "./florist";
import { FlowerFormula } from "./flower-formula";
import { Promotion } from "./promotion";

export interface PromotionDetailLog {
    id: number;
    profit: number;
    price: number;
    quantity: number;
    quantitySold: number;
    status: string;
    promotions: Promotion; 
    flowerFormula: FlowerFormula;
    sequence: number;
    promotionType: string;
    florist: Florist;
    lotStock: Date;
    totalProfit: number;
}
