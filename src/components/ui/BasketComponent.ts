import { IEventEmitter } from '../../types/IEventEmitter';
import { ensureElement } from '../../utils/utils';

import { Component } from './Component';

/**
 * Компонент отображения корзины
 */
export class BasketComponent extends Component {
	/**
	 * Список продуктов в корзине
	 */
	protected listElement: HTMLElement;
	/**
	 * Общая сумма заказа
	 */
	protected totalPriceElement: HTMLElement;
	/**
	 * Кнопка "Оформить заказ"
	 */
	protected buttonElement: HTMLButtonElement;

	constructor(element: HTMLElement, eventEmitter: IEventEmitter) {
		super(element, eventEmitter);

		this.listElement = ensureElement('.basket__list', this.element);
		this.totalPriceElement = ensureElement('.basket__price', this.element);
		this.buttonElement = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.element
		);
		this.buttonElement.addEventListener('click', () => {
			this.eventEmitter.emit('open-order-form');
		});
	}

	/**
	 * Обновляет список продуктов в корзине
	 * @param elements - список elements
	 */
	updateContent(elements: HTMLElement[]) {
		this.listElement.innerHTML = '';
		this.listElement.append(...elements);
	}

	/**
	 * Обновляет общую сумму заказа
	 * @param value - сумма заказа
	 */
	updateTotal(value: number) {
		this.totalPriceElement.textContent =
			new Intl.NumberFormat('ru-RU').format(value) + ' синапсов';
	}
}

