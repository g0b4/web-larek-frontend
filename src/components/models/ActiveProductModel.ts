import { IProductItem } from '../../types';
import { IEventEmitter } from '../../types/IEventEmitter';
import { AbstractModel } from './AbstractModel';

export class ActiveProductModel extends AbstractModel<IProductItem | null> {
	value: IProductItem | null;

	constructor(eventEmitter: IEventEmitter) {
		super(eventEmitter);
	}
	reset() {
		this.setValue(null);
	}
	setValue(value: IProductItem | null) {
		this.value = value;
		this.eventEmitter.emit('active-product-updated');
	}
}
