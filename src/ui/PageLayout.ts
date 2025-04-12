import { IPageData } from "../types";
import { ensureElement } from "../utils/domHelpers";
import { Component } from "../core/Component";
import { IEvents } from "../core/EventBus";

export class PageLayout extends Component<IPageData> {
  protected _counter: HTMLSpanElement;
  protected _buttonBasket: HTMLButtonElement;
  protected _gallery: HTMLElement;
  protected _wrapper: HTMLElement;
  protected _locked: boolean;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this.events = events;
    this._counter = ensureElement<HTMLSpanElement>('.header__basket-counter', container);
    this._buttonBasket = ensureElement<HTMLButtonElement>('.header__basket', container);
    this._gallery = ensureElement<HTMLElement>('.gallery', container);
    this._wrapper = ensureElement<HTMLElement>('.page__wrapper', container);

    this._buttonBasket.addEventListener('click', () => {
      this.events.emit('cart:view'); // исправлено на cart:view для согласованности
    });
  }

  set counter(value: number) {
    this.setText(this._counter, value.toString());
  }

  set gallery(items: HTMLElement[]) {
    this._gallery.replaceChildren(...items);
  }

  set locked(value: boolean) {
    this._locked = value;
    this._wrapper.classList.toggle('page__wrapper_locked', value);
  }

  lockScroll() {
    this.locked = true;
  }

  unlockScroll() {
    this.locked = false;
  }

  updateCartIndicator(count: number) {
    this.counter = count;
  }

  renderProducts(products: HTMLElement[]) {
    this.gallery = products;
  }
}