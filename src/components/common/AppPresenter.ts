import { CartModel } from '../CartModel';
import { ProductModel } from '../ProductModel';
import { ProductCardView } from '../ProductCardView';

export class AppPresenter {
  constructor(
    private cart: CartModel,
    private products: ProductModel[]
  ) {}

  init() {
    // привязка логики к отображению
  }
}
