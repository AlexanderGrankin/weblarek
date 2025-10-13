import { Api } from "../base/Api";
import { IProductCatalogResult, IOrder, IOrderResult } from "../../types";

export class Communication extends Api{
    constructor(baseUrl: string, options: RequestInit = {}) {
        super(baseUrl, options); 
    }

    getData(): Promise<IProductCatalogResult> {
        return this.get<IProductCatalogResult>("/product/");
    }

    postData(order: IOrder): Promise<IOrderResult> {
        return this.post<IOrderResult>("/order/", order);
    }
}