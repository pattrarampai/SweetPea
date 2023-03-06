import { PackageId } from "typescript";
import { Florist } from "./florist";
import { Flower } from "./flower";
import { FlowerFormula } from "./flower-formula";
import { FlowerPrice } from "./flower-price";
import { Pack } from "./Pack";
import { PurchaseOrder } from "./purchase-order";
import { SalesOrder } from "./sales-order";
import { Supplier } from "./Supplier";

export interface PurchaseOrderDetail {
    id: number;
    purchaseOrder: PurchaseOrder;
    quantity: number;
    flower: Flower;
    florist: Florist;
    packId : Pack;
    supplier: Supplier;
    priceId: FlowerPrice;
    lot: "2022-12-11"
}