import { FlowerMultipleDto } from "./flower-multiple-dto";

export interface SalesOrderElement {
    id: number;
    date: string;
    price: number;
    customerName: string;
    customerLineFb: string;
    customerPhone: string;
    receiverName: string;
    receiverAddress: string;
    receiverPhone: string;
    deliveryDateTime: Date;
    flowerMultipleDtoList: FlowerMultipleDto[]
    receiveDateTime: Date;
    deliveryPrice: string;
    flowerPrice: number;
    deliveryFee: string;
    totalPrice: string;
    florist: number;
    note: string;
    status: string;
}

