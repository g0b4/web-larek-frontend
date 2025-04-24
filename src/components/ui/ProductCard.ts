import { IProductItem } from '../../types';
import { IEventEmitter } from '../../types/IEventEmitter';
import {
	ensureElement,
	getElementData,
	setElementData,
} from '../../utils/utils';
import { Component } from './Component';

/**
 * Абстрактный класс для карточек продуктов
 */
export abstract class ProductCard extends Component {
	/**
	 * Элемент с заголовком продукта
	 */
	protected titleElement: HTMLElement;

	/**
	 * Элемент с ценой продукта
	 */
	protected priceElement: HTMLElement;

	/**
	 * @param element - HTML-элемент, содержащий компонент
	 * @param eventEmitter - эмиттер событий
	 */
	constructor(element: HTMLElement, eventEmitter: IEventEmitter) {
		super(element, eventEmitter);
		this.titleElement = ensureElement('.card__title', this.element);
		this.priceElement = ensureElement('.card__price', this.element);
	}

	/**
	 * Обновляет информацию о продукте
	 * @param value - обновленная информация о продукте
	 */
	update(value: IProductItem) {
		setElementData(this.element, { id: value.id });
		this.titleElement.textContent = value.title;
		this.priceElement.textContent =
			Intl.NumberFormat('ru-RU').format(value.price) + ' синапсов';
	}

	/**
	 * Возвращает ID продукта
	 */
	get id() {
		return getElementData<{ id: string }>(this.element, {
			id: (value: string) => value,
		}).id;
	}
}
