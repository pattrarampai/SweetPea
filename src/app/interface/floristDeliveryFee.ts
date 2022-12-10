export interface FloristDeliveryFee {
    id: number;
    floristId: number;
    name: string;
    address : string;
    location: google.maps.LatLng;
    distance : number;
    deliveryFee: number;
}