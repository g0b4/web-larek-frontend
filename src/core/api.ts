import {
	IProductData,
	IOrderForm,
	IOrderConfirmation,
  } from '../types/models'; 
  
  export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
  };
  
  export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
  
  export class Api {
	readonly baseUrl: string;
	protected options: RequestInit;
  
	constructor(baseUrl: string, options: RequestInit = {}) {
	  this.baseUrl = baseUrl;
	  this.options = {
		headers: {
		  'Content-Type': 'application/json',
		  ...(options.headers ?? {}),
		},
		...options,
	  };
	}
  
	protected handleResponse<T>(response: Response): Promise<T> {
	  if (response.ok) {
		return response.json();
	  } else {
		return response.json().then((data) =>
		  Promise.reject(data?.error ?? response.statusText)
		);
	  }
	}
  
	get<T>(uri: string): Promise<T> {
	  return fetch(this.baseUrl + uri, {
		...this.options,
		method: 'GET',
	  }).then((res) => this.handleResponse<T>(res));
	}
  
	post<T>(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<T> {
	  return fetch(this.baseUrl + uri, {
		...this.options,
		method,
		body: JSON.stringify(data),
	  }).then((res) => this.handleResponse<T>(res));
	}
  
	fetchProducts(): Promise<IProductData[]> {
	  return this.get<IProductData[]>('/products');
	}
  
	placeOrder(order: IOrderForm): Promise<IOrderConfirmation> {
	  return this.post<IOrderConfirmation>('/order', order, 'POST');
	}
  }
  
  export const apiClient = new Api('http://localhost:8080');