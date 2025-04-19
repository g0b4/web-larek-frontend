import { ensureElement } from '../../utils/utils';
import { BaseComponent } from './BaseComponent';

export class Order extends BaseComponent {
	orderType?: string;
	address?: string;
	isValid = false;
	refresh() {
		if (this.orderType === 'cash') {
			this.element
				.querySelector('button[name="cash"]')
				.classList.add('button_alt-active');
		} else {
			this.element
				.querySelector('button[name="cash"]')
				.classList.remove('button_alt-active');
		}

		if (this.orderType === 'card') {
			this.element
				.querySelector('button[name="card"]')
				.classList.add('button_alt-active');
		} else {
			this.element
				.querySelector('button[name="card"]')
				.classList.remove('button_alt-active');
		}

		if (this.orderType && this.address && this.address.length > 0) {
			this.isValid = true;
		} else {
			this.isValid = false;
		}
		this.element.querySelector<HTMLButtonElement>('.order__button').disabled =
			!this.isValid;
	}
	constructor() {
		super();
		this.setTemplate(ensureElement<HTMLTemplateElement>('#order'));

		[...this.element.querySelectorAll('.order__buttons button')].forEach(
			(el) => {
				el.addEventListener('click', (event) => {
					const name = (event.target as HTMLButtonElement).getAttribute('name');
					console.log(`👉 name:`, name);
					this.orderType = name;
					this.refresh();
				});
			}
		);
		this.element
			.querySelector('input[name="address"]')
			.addEventListener('input', (event) => {
				const value = (event.target as HTMLButtonElement).value;
				this.address = value;
				this.refresh();
			});

		this.element
			.querySelector('.order__button')
			.addEventListener('click', () => {
				this.eventEmitter.emit('submit', {
					orderType: this.orderType,
					address: this.address,
				});
			});
	}
}
