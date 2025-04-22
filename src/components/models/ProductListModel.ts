import { IProductItem } from '../../types';
import { IEventEmitter } from '../../types/IEventEmitter';
import { AbstractModel } from './AbstractModel';

export class ProductListModel extends AbstractModel<IProductItem[]> {
	value: IProductItem[] = [];
	constructor(eventEmitter: IEventEmitter) {
		super(eventEmitter);
	}
	reset() {
		this.setValue([]);
		this.eventEmitter.emit('product-list-updated');
	}
	setValue(value: IProductItem[]) {
		this.value = value;
		this.eventEmitter.emit('product-list-updated');
	}
}
