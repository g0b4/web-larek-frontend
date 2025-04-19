import { IOrderPayload } from '../../types';
import { ensureElement } from '../../utils/utils';
import { BaseComponent } from './BaseComponent';

export class Success extends BaseComponent {
	value?: IOrderPayload;
	constructor(value: IOrderPayload) {
		super();
		this.setTemplate(ensureElement<HTMLTemplateElement>('#success'));

		this.element.querySelector(
			'.order-success__description'
		).textContent = `Списано ${value.total} синапсов`;

		this.element
			.querySelector('.order-success__close')
			.addEventListener('click', () => {
				this.eventEmitter.emit('close');
			});
	}
}
