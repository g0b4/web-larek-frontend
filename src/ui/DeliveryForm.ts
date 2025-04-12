import { IOrderForm } from '../types/models';
import { IEvents } from '../core/EventBus';
import { Form } from '../core/Form';
import { ensureElement } from '../utils/domHelpers';

export class DeliveryForm extends Form<IOrderForm> {
  protected _paymentCard: HTMLButtonElement;
  protected _paymentCash: HTMLButtonElement;
  protected _addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._paymentCard = ensureElement<HTMLButtonElement>('.button_alt[name="card"]', this.form);
    this._paymentCash = ensureElement<HTMLButtonElement>('.button_alt[name="cash"]', this.form);
    this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.form);


    this._paymentCard.addEventListener('click', () => this.togglePayment('card'));
    this._paymentCash.addEventListener('click', () => this.togglePayment('cash'));
  }

  set address(value: string) {
    this._addressInput.value = value;
  }

  set payment(value: string) {
    this.togglePayment(value);
  }

  private togglePayment(method: string) {
    if (method === 'card') {
      this._paymentCard.classList.add('button_alt-active');
      this._paymentCash.classList.remove('button_alt-active');
    } else if (method === 'cash') {
      this._paymentCard.classList.remove('button_alt-active');
      this._paymentCash.classList.add('button_alt-active');
    }

    this.events.emit('order.payment:changed', { payment: method });
  }

}