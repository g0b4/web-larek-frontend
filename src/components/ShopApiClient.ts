import { IOrder, IOrderResult, IProduct } from '../types';
import { Api, ApiListResponse } from '../core/api';

export interface IApiShop {
	getItemList: () => Promise<IProduct[]>;
	getItem: (id: string) => Promise<IProduct>;
	orderProduct: (order: IOrder) => Promise<IOrderResult>;
}

export class ShopApiClient extends Api implements IApiShop {
	protected cdnUrl: string;

	constructor(cdnUrl: string, apiUrl: string) {
		super(apiUrl); 
		this.cdnUrl = cdnUrl;
	}

	getItemList(): Promise<IProduct[]> {
		return this.get<ApiListResponse<IProduct>>('/product').then((data) =>
			data.items.map((item) => ({
				...item,
				image: this.cdnUrl + item.image,
			}))
		);
	}

	getItem(id: string): Promise<IProduct> {
		return this.get<IProduct>(`/product/${id}`).then((item) => ({
			...item,
			image: this.cdnUrl + item.image,
		}));
	}

	orderProduct(order: IOrder): Promise<IOrderResult> {
		return this.post<IOrderResult>('/order', order);
	}
}