import { IProduct } from '../types';

export class ProductModel {
  constructor(public data: IProduct) {}

  get id() {
    return this.data.id;
  }

}