import { PurchaseOrderDetail } from "./purchase-order-detail";

export interface PurchaseOrderDetailListDto {
    id: number,
    date: Date,
    status: string,
    purchaseOrderDetails: PurchaseOrderDetail[],
}