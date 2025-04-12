import { IFormState } from '../types';
import { ensureElement } from '../utils/domHelpers';
import { Component } from './Component';
import { IEvents } from './EventBus';

export class Form<T> extends Component<IFormState> {
  protected _button: HTMLButtonElement;
  protected _errors: HTMLSpanElement;
  protected form: HTMLFormElement;

  protected _valid = false;
  protected _errorsText = '';

  constructor(container: HTMLFormElement, protected events: IEvents) {
    super(container);

    this.form = container;
    this._button = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
    this._errors = ensureElement<HTMLSpanElement>('.form__errors', container);

    this.form.addEventListener('submit', (evt) => {
      evt.preventDefault();
      this.events.emit(`${this.form.name}:submit`);
    });

    this.form.addEventListener('input', (evt: Event) => {
      const target = evt.target as HTMLInputElement;
      const field = target.name as keyof T;
      const value = target.value;
      this.onInputChange(field, value);
    });
  }

  protected onInputChange(field: keyof T, value: string) {
    this.events.emit(`${this.form.name}.${String(field)}:change`, { field, value });
  }

  set valid(state: boolean) {
    this._valid = state;
    this.setDisabled(this._button, !state);
  }

  get valid(): boolean {
    return this._valid;
  }

  set errors(value: string | string[]) {
	const errorText = Array.isArray(value) ? value.join('; ') : value;
	this.setText(this._errors, errorText);
  }

  get errors(): string {
    return this._errorsText;
  }

  render(data: Partial<T> & IFormState): HTMLElement {
    const { errors, ...inputs } = data;
    this.errors = errors ?? '';
    Object.assign(this, inputs);
    return this.container;
  }
}