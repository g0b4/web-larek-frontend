import { IProductItem } from './IProductItem';

export type IOrder = {
	payment: string;
	address: string;
	email: string;
	phone: string;
	items: IProductItem[];
};
