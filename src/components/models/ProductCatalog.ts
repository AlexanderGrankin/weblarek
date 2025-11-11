import { IProduct } from "../../types"
import { IEvents } from "../base/Events";

export class ProductCatalog{
    products: IProduct[] = [];
    selectedProduct: IProduct | null = null;

    constructor(private events: IEvents){
        this.events = events;
    }

    setProducts(products: IProduct[]): void {
        this.products = products;
        this.events.emit('catalog:changed');
    }

    getProducts(): IProduct[] {
        return this.products;
    }

    getProductById(id: string): IProduct | null {
        return this.products.find(product => product.id === id) || null;
    }

    setSelectedProduct(product: IProduct): void {
        this.selectedProduct = product;
        this.events.emit('catalog:product-selected')
    }

    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }
}