import { DefaultDTO } from ".";
import { Customer } from "../model/customer";

export interface CustomerDTO extends DefaultDTO {
    metadata: Customer[];

}