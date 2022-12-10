import { FlowerFormula } from "./flower-formula";
import { Flower } from "./flower";

export interface FlowerFormulaDetail {
    id: number;
    flowerFormula: FlowerFormula;
    flower: Flower;
    quantity: number;
}