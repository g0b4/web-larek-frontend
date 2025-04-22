import { IProductItem } from '../../types';
import { IEventEmitter } from '../../types/IEventEmitter';
import {
	ensureElement,
	getElementData,
	setElementData,
} from '../../utils/utils';
import { Component } from './Component';

export abstract class ProductCard extends Component {
	protected titleElement: HTMLElement;
	protected priceElement: HTMLElement;

	constructor(element: HTMLElement, eventEmitter: IEventEmitter) {
		super(element, eventEmitter);
		this.titleElement = ensureElement('.card__title', this.element);
		this.priceElement = ensureElement('.card__price', this.element);
	}

	update(value: IProductItem) {
		setElementData(this.element, { id: value.id });
		this.titleElement.textContent = value.title;
		this.priceElement.textContent =
			Intl.NumberFormat('ru-RU').format(value.price) + ' синапсов';
	}

	get id() {
		return getElementData<{ id: string }>(this.element, {
			id: (value: string) => value,
		}).id;
	}
}
