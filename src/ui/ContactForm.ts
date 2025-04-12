import { IContactsForm } from '../types';
import { IEvents } from '../core/EventBus';
import { Form } from '../core/Form';

export class ContactForm extends Form<IContactsForm> {
  protected _email: HTMLInputElement;
  protected _phone: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._email = this.form.elements.namedItem('email') as HTMLInputElement;
    this._phone = this.form.elements.namedItem('phone') as HTMLInputElement;
  }

  set email(value: string) {
    this._email.value = value;
  }

  set phone(value: string) {
    this._phone.value = value;
  }
}