import './scss/styles.scss';

import { AppPresenter } from './presenters/AppPresenter';
import { ApiClient } from './components/ApiClient';
import { CatalogView } from './views/CatalogView';
import { CartView } from './views/CartView';
import { ModalView } from './views/ModalView';
import { CheckoutView } from './views/CheckoutView';

import { ProductModel } from './models/ProductModel';
import { CartModel } from './models/CartModel';
import { OrderModel } from './models/OrderModel';

import { EventEmitter } from './components/EventEmitter';

// Создание экземпляров базовых компонентов
const api = new ApiClient();
const events = new EventEmitter();

const catalogView = new CatalogView(events);
const cartView = new CartView(events);
const modalView = new ModalView(events);
const checkoutView = new CheckoutView(events);

const productModel = new ProductModel(api, events);
const cartModel = new CartModel(events);
const orderModel = new OrderModel(events);

// Инициализация главного Presenter'а
const app = new AppPresenter({
  catalogView,
  cartView,
  modalView,
  checkoutView,
  productModel,
  cartModel,
  orderModel,
  events
});

app.init();