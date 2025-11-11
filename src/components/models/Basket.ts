import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Basket {
  products: IProduct[] = [];

  constructor(protected events: IEvents){
    this.events = events;
    this.products = []
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  addProduct(product: IProduct): void {
    this.products.push(product);
    this.events.emit('basket:changed');
  }

  removeProduct(product: IProduct): void {

    const index = this.products.findIndex(item => item.id === product.id);
    if (index !== -1) {
      this.products.splice(index, 1);
      this.events.emit('basket:changed');
    }
    
  }

  clear(): void {
    this.products = [];
    this.events.emit('basket:changed');
  }

  getTotalPrice(): number {
    return this.products.reduce((total, product) => {
      return total + (product.price || 0);
    }, 0);
  }

  getProductsCount(): number {
    return this.products.length;
  }

  hasProduct(productId: string): boolean {
    return this.products.some(item => item.id === productId);
  }
}