import { IEventEmitter } from '../../types/IEventEmitter';
import { ensureElement } from '../../utils/utils';
import { Component } from './Component';

export class OrderFormComponent extends Component {
	cashButton: HTMLButtonElement;
	cardButton: HTMLButtonElement;
	submitButton: HTMLButtonElement;
	addressInput: HTMLInputElement;
	errorsElement: HTMLElement;

	constructor(element: HTMLElement, eventEmitter: IEventEmitter) {
		super(element, eventEmitter);

		this.cashButton = ensureElement<HTMLButtonElement>(
			'button[name=cash]',
			this.element
		);
		this.cardButton = ensureElement<HTMLButtonElement>(
			'button[name=card]',
			this.element
		);
		this.submitButton = ensureElement<HTMLButtonElement>(
			'.order__button',
			this.element
		);
		this.addressInput = ensureElement<HTMLInputElement>(
			'input[name=address]',
			this.element
		);
		this.errorsElement = ensureElement<HTMLElement>(
			'.form__errors',
			this.element
		);

		this.addressInput.addEventListener('input', (e) => {
			this.eventEmitter.emit('order-field:input', {
				field: 'address',
				value: (e.target as HTMLInputElement).value,
			});
		});
		this.cardButton.addEventListener('click', () => {
			this.eventEmitter.emit('order-field:input', {
				field: 'payment',
				value: 'card',
			});
		});
		this.cashButton.addEventListener('click', () => {
			this.eventEmitter.emit('order-field:input', {
				field: 'payment',
				value: 'cash',
			});
		});
		this.submitButton.addEventListener('click', (e) => {
			e.preventDefault();
			this.eventEmitter.emit('open-contacts-form');
		});
	}

	updatePayment(value: string) {
		if (value === 'cash') {
			this.cashButton.classList.add('button_alt-active');
		} else {
			this.cashButton.classList.remove('button_alt-active');
		}

		if (value === 'card') {
			this.cardButton.classList.add('button_alt-active');
		} else {
			this.cardButton.classList.remove('button_alt-active');
		}
	}
	updateAddress(value: string) {
		this.addressInput.value = value;
	}
	updateSubmitButtonState({ disabled }: { disabled: boolean }) {
		this.submitButton.disabled = disabled;
	}
	updateErrors(errors: string[]) {
		this.errorsElement.innerHTML = errors
			.map((error) => `<p>${error}</p>`)
			.join('');
	}
}
