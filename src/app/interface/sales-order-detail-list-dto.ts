import { SalesOrderDetail } from "./sales-order-detail";

export interface SalesOrderDetailListDto {
    id: number,
    date: Date,
    price: number,
    customerName: string,
    customerLineFb: string,
    customerPhone: string,
    receiverName: string,
    receiverAddress: string,
    receiverPhone: string,
    note: string,
    receiveDateTime: Date,
    status: string,
    deliveryFee: number,
    totalPrice: number,
    flowerPrice: number,
    salesOrderDetails: SalesOrderDetail[],
}