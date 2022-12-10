export interface SalesOrder {
    id: number;
    date: string;
    price: number;
    customerName: string;
    customerLineFb: string;
    customerPhone: string;
    receiverName: string;
    receiverAddress: string;
    receiverPhone: string;
    note: string;
    deliveryDateTime: Date;
    receiveDateTime: Date;
    status: string;
    deliveryPrice: number;
    totalPrice: number;
}