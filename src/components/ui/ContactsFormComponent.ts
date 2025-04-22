import { IEventEmitter } from '../../types/IEventEmitter';
import { ensureElement } from '../../utils/utils';
import { Component } from './Component';

export class ContactsFormComponent extends Component {
	submitButton: HTMLButtonElement;
	emailInput: HTMLInputElement;
	phoneInput: HTMLInputElement;
	errorsElement: HTMLElement;

	constructor(element: HTMLElement, eventEmitter: IEventEmitter) {
		super(element, eventEmitter);

		this.submitButton = ensureElement<HTMLButtonElement>(
			'button[type="submit"]',
			this.element
		);
		this.emailInput = ensureElement<HTMLInputElement>(
			'input[name="email"]',
			this.element
		);
		this.phoneInput = ensureElement<HTMLInputElement>(
			'input[name="phone"]',
			this.element
		);

		this.emailInput.addEventListener('input', (e) => {
			this.eventEmitter.emit('order-field:input', {
				field: 'email',
				value: (e.target as HTMLInputElement).value,
			});
		});
		this.phoneInput.addEventListener('input', (e) => {
			this.eventEmitter.emit('order-field:input', {
				field: 'phone',
				value: (e.target as HTMLInputElement).value,
			});
		});

		this.errorsElement = ensureElement<HTMLElement>(
			'.form__errors',
			this.element
		);

		this.submitButton.addEventListener('click', (e) => {
			e.preventDefault();
			this.eventEmitter.emit('submit:contacts');
		});
	}

	updatePhone(value: string) {
		this.emailInput.value = value;
	}
	updateEmail(value: string) {
		this.phoneInput.value = value;
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
