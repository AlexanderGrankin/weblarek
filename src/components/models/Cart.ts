import { IProduct } from "../../types";

export class Cart {
  products: IProduct[] = [];

  getProducts(): IProduct[] {
    return this.products;
  }

  addProduct(product: IProduct): void {
    this.products.push(product);
  }

  removeProduct(product: IProduct): void {
    const index = this.products.findIndex(item => item.id === product.id);
    if (index !== -1) {
      this.products.splice(index, 1);
    }
  }

  clear(): void {
    this.products = [];
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