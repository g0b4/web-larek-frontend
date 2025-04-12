import { IBasketData } from '../types';
import { createElement, ensureElement, formatNumber } from '../utils/domHelpers';
import { Component } from '../core/Component';
import { IEvents } from '../core/EventBus';

export class CartView extends Component<IBasketData> {
  protected _basketList: HTMLElement;
  protected _button: HTMLButtonElement;
  protected _total: HTMLSpanElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this.events = events;
    this._basketList = ensureElement<HTMLElement>('.basket__list', container);
    this._button = ensureElement<HTMLButtonElement>('.basket__button', container);
    this._total = ensureElement<HTMLSpanElement>('.basket__price', container);

    this._button.addEventListener('click', () => {
      this.events.emit('order:open');
    });

    this.items = [];
  }

  set items(items: HTMLElement[]) {
    if (items.length) {
      this._basketList.replaceChildren(...items);
      this.setDisabled(this._button, false);
    } else {
      const emptyMessage = createElement<HTMLParagraphElement>('p', {
        textContent: 'Корзина пуста',
        className: 'basket__empty'
      });
      this._basketList.replaceChildren(emptyMessage);
      this.setDisabled(this._button, true);
    }
  }

  set total(value: number) {
    this.setText(this._total, `${formatNumber(value)} синапсов`);
  }

  // 🔧 Методы для совместимости с index.ts

  updateItems(items: HTMLElement[]): void {
    this.items = items;
  }

  updateTotal(value: number): void {
    this.total = value;
  }
}