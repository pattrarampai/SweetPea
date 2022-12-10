import { FlowerFormula } from "./flower-formula";
import { Promotion } from "./promotion";
import { Florist } from "./florist";

export interface PromotionDetail {
    id: number;
    profit: number;
    price: number;
    quantity: number;
    quantitySold: number;
    status: string;
    promotions: Promotion; 
    flowerFormula: FlowerFormula;
    expiryDate: Date;
    florist: Florist;
    type: string;
    lotStock: Date;
  }