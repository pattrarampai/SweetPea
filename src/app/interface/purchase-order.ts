import { PurchaseOrderDetail } from "./purchase-order-detail";

export interface PurchaseOrder {
    id: number,
    date: Date,
    status: string,
    total: number,
    transportationFee: number
}