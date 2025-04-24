import { IEventEmitter } from '../../types/IEventEmitter';
import { ensureElement } from '../../utils/utils';
import { Component } from './Component';

export class SuccessComponent extends Component {
	/**
	 * Элемент, содержащий описание заказа.
	 * @protected
	 */
	protected descriptionElement: HTMLElement;

	/**
	 * Кнопка закрытия окна.
	 * @protected
	 */
	protected closeButton: HTMLElement;

	/**
	 * Создаёт экземпляр SuccessComponent.
	 * @param element - HTML-элемент, содержащий компонент.
	 * @param eventEmitter - эмиттер событий.
	 */
	constructor(element: HTMLElement, eventEmitter: IEventEmitter) {
		super(element, eventEmitter);

		this.descriptionElement = ensureElement(
			'.order-success__description',
			this.element
		);
		this.closeButton = ensureElement('.order-success__close', this.element);
		this.closeButton.addEventListener('click', () => {
			this.eventEmitter.emit('close-success');
		});
	}

	/**
	 * Обновляет текстовое описание заказа.
	 * @param value - общая сумма заказа.
	 */
	updateTotal(value: number) {
		this.descriptionElement.textContent = `Списано ${value} синапсов`;
	}
}

