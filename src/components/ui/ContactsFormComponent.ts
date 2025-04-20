import { IAppState } from '../../types/IAppState';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { Component } from './Component';

export class ContactsFormComponent extends Component {
	submitButton: HTMLButtonElement;
	emailInput: HTMLInputElement;
	phoneInput: HTMLInputElement;
	errorsElement: HTMLElement;

	constructor(appState: IAppState) {
		super(
			cloneTemplate(ensureElement<HTMLTemplateElement>('#contacts')),
			appState
		);

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

		this.emailInput.addEventListener('input', () => {
			this.appState.order.updateField('email', this.emailInput.value);
		});
		this.phoneInput.addEventListener('input', () => {
			this.appState.order.updateField('phone', this.phoneInput.value);
		});

		this.errorsElement = ensureElement<HTMLElement>(
			'.form__errors',
			this.element
		);

		this.submitButton.addEventListener('click', (e) => {
			e.preventDefault();
			this.appState.submitOrder();
		});
		this.appState.order.eventEmitter.on('updated', () => {
			this.update();
		});
		this.update();
	}

	update() {
		this.emailInput.value = this.appState.order.value.email;
		this.phoneInput.value = this.appState.order.value.phone;

		if (this.appState.order.validateContacts()) {
			this.submitButton.disabled = false;
		} else {
			this.submitButton.disabled = true;
		}
		this.errorsElement.innerHTML = '';
		if (this.appState.order.errors) {
			this.errorsElement.innerHTML = this.appState.order.errors
				.map((error) => `<p>${error}</p>`)
				.join('');
		}
	}
}
