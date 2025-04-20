import { IProductItem } from '../../types';

abstract class Model<T> {
	value: T;
	constructor(value: T) {
		this.value = value;
	}
	abstract validate(): boolean;
}

export class ProductItemModel extends Model<IProductItem> {
	validate(): boolean {
		throw new Error('Method not implemented.');
	}
}
