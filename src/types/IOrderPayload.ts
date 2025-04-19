export interface IOrderPayload {
	payment: string;
	address: string;
	email: string;
	phone: string;
	items: string[];
	total: number;
}