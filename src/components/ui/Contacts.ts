import { ensureElement } from '../../utils/utils';
import { BaseComponent } from './BaseComponent';

export class Contacts extends BaseComponent {
	phone?: string;
	email?: string;
	isValid = false;
	refresh() {
		if (
			this.email &&
			this.email.length > 0 &&
			this.phone &&
			this.phone.length > 0
		) {
			this.isValid = true;
		} else {
			this.isValid = false;
		}
		this.element.querySelector<HTMLButtonElement>('.button').disabled =
			!this.isValid;
	}
	constructor() {
		super();
		this.setTemplate(ensureElement<HTMLTemplateElement>('#contacts'));

		this.element
			.querySelector('input[name="email"]')
			.addEventListener('input', (event) => {
				const value = (event.target as HTMLButtonElement).value;
				this.email = value;
				this.refresh();
			});
		this.element
			.querySelector('input[name="phone"]')
			.addEventListener('input', (event) => {
				const value = (event.target as HTMLButtonElement).value;
				this.phone = value;
				this.refresh();
			});

		this.element.querySelector('.button').addEventListener('click', () => {
			this.eventEmitter.emit('submit', {
				phone: this.phone,
				email: this.email,
			});
		});
	}
}
