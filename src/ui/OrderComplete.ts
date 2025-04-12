import { ISuccessData, ISuccessAction } from '../types/index';
import { ensureElement, formatNumber } from '../utils/domHelpers';
import { Component } from '../core/Component';

export class OrderComplete extends Component<ISuccessData> {
  protected _description: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, actions: ISuccessAction) {
    super(container);
    this._description = ensureElement<HTMLElement>('.order-success__description', container);
    this._button = ensureElement<HTMLButtonElement>('.order-success__close', container);

    this._button.addEventListener('click', actions.onClick);
  }

  render(data: ISuccessData): HTMLElement {
    this.setText(this._description, `Списано ${formatNumber(data.description)} синапсов`);
    return this.container;
  }
}