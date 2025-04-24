import { IEventEmitter } from '../../types/IEventEmitter';
import { ensureAllElements, ensureElement } from '../../utils/utils';
import { Component } from './Component';

/**
 * Компонент страницы
 *
 * @class PageComponent
 * @extends {Component}
 */
export class PageComponent extends Component {
	/**
	 * Элемент счетчика корзины
	 *
	 * @private
	 * @type {HTMLElement}
	 * @memberof PageComponent
	 */
	private cartCounterElement: HTMLElement;

	/**
	 * Кнопка корзины в хедере
	 *
	 * @private
	 * @type {HTMLButtonElement}
	 * @memberof PageComponent
	 */
	private headerBasketButton: HTMLButtonElement;

	/**
	 * Creates an instance of PageComponent.
	 *
	 * @param {HTMLElement} element - Корневой элемент компонента
	 * @param {IEventEmitter} eventEmitter - эмиттер событий
	 * @memberof PageComponent
	 */
	constructor(element: HTMLElement, eventEmitter: IEventEmitter) {
		super(element, eventEmitter);

		this.cartCounterElement = ensureElement(
			'.header__basket-counter',
			this.element
		);
		this.headerBasketButton = ensureElement<HTMLButtonElement>(
			'.header__basket',
			this.element
		);
		ensureAllElements('.modal', this.element).forEach((modal) => {
			modal.classList.remove('modal_active');
		});
		this.headerBasketButton.addEventListener('click', () => {
			this.eventEmitter.emit('open-basket');
		});
	}

	/**
	 * Обновляет счетчик корзины
	 *
	 * @param {number} value - Новое значение счетчика
	 * @memberof PageComponent
	 */
	updateCounter(value: number) {
		this.cartCounterElement.textContent = value.toString();
	}
}
