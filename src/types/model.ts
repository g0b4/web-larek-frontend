import { ProductServer } from './product';

export interface IProductModel {
  products: ProductServer[];
  getProductById(id: string): ProductServer | undefined;
  load(): Promise<void>;
}
