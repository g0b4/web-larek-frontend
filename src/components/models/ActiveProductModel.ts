import { IProductItem } from '../../types';
import { IEventEmitter } from '../../types/IEventEmitter';
import { AbstractModel } from './AbstractModel';
/**
 * Модель активного продукта
 *
 * @class ActiveProductModel
 * @extends {AbstractModel<IProductItem | null>}
 */
export class ActiveProductModel extends AbstractModel<IProductItem | null> {
	/**
	 * Текущий активный продукт
	 * @type {(IProductItem | null)}
	 */
	value: IProductItem | null;

	constructor(eventEmitter: IEventEmitter) {
		super(eventEmitter);
	}

	/**
	 * Сбрасывает модель до изначального состояния
	 */
	reset() {
		this.setValue(null);
	}

	/**
	 * Обновляет модель
	 * @param {IProductItem | null} value - новый активный продукт
	 */
	setValue(value: IProductItem | null) {
		this.value = value;
		this.eventEmitter.emit('active-product-updated');
	}
}

