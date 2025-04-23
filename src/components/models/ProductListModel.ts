import { IProductItem } from '../../types';
import { IEventEmitter } from '../../types/IEventEmitter';
import { AbstractModel } from './AbstractModel';

/**
 * Модель списка продуктов
 * @class ProductListModel
 * @extends {AbstractModel<IProductItem[]>}
 */
export class ProductListModel extends AbstractModel<IProductItem[]> {
	/**
	 * Список продуктов
	 * @type {IProductItem[]}
	 */
	value: IProductItem[] = [];

	/**
	 * @param {IEventEmitter} eventEmitter - эмитер событий
	 */
	constructor(eventEmitter: IEventEmitter) {
		super(eventEmitter);
	}

	/**
	 * Обнуляет список продуктов
	 */
	reset() {
		this.setValue([]);
		this.eventEmitter.emit('product-list-updated');
	}

	/**
	 * Обновляет список продуктов
	 * @param {IProductItem[]} value - новый список продуктов
	 */
	setValue(value: IProductItem[]) {
		this.value = value;
		this.eventEmitter.emit('product-list-updated');
	}
}
