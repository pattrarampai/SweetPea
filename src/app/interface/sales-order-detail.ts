import { Florist } from "./florist";
import { FlowerFormula } from "./flower-formula";
import { SalesOrder } from "./sales-order";

export interface SalesOrderDetail {
    id: number;
    salesOrder: SalesOrder;
    flowerFormula: FlowerFormula;
    quantity: number;
    florist: Florist;
}