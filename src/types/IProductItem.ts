export type ProductItemCategory =
	| 'софт-скил'
	| 'другое'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил'
	| string;

export interface IProductItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: ProductItemCategory;
	price: number;
}
