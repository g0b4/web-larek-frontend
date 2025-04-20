import { IAppState } from '../../types/IAppState';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { Component } from './Component';

export class OrderFormComponent extends Component {
	cashButton: HTMLButtonElement;
	cardButton: HTMLButtonElement;
	submitButton: HTMLButtonElement;
	addressInput: HTMLInputElement;

	constructor(appState: IAppState) {
		super(
			cloneTemplate(ensureElement<HTMLTemplateElement>('#order')),
			appState
		);

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

		this.addressInput.addEventListener('input', () => {
			this.appState.order.updateField('address', this.addressInput.value);
		});
		this.cardButton.addEventListener('click', () => {
			this.appState.order.updateField('payment', 'card');
		});
		this.cashButton.addEventListener('click', () => {
			this.appState.order.updateField('payment', 'cash');
		});
		this.submitButton.addEventListener('click', (e) => {
			e.preventDefault();
			this.appState.openContactsForm();
		});
		this.appState.order.eventEmitter.on('updated', () => {
			this.update();
		});
		this.update();
	}

	update() {
		this.addressInput.value = this.appState.order.value.address;
		if (this.appState.order.value.payment === 'cash') {
			this.cashButton.classList.add('button_alt-active');
		} else {
			this.cashButton.classList.remove('button_alt-active');
		}

		if (this.appState.order.value.payment === 'card') {
			this.cardButton.classList.add('button_alt-active');
		} else {
			this.cardButton.classList.remove('button_alt-active');
		}

		if (this.appState.order.validateOrder()) {
			this.submitButton.disabled = false;
		} else {
			this.submitButton.disabled = true;
		}
	}
}
